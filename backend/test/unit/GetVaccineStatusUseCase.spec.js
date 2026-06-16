const {
  GetVaccineStatusUseCase,
} = require("../../src/domain/usecases/CreateVaccineUseCase");
const Vaccine = require("../../src/domain/entities/Vaccine");

describe("GetVaccineStatusUseCase", () => {
  let vaccineRepository, usecase;

  const make = (overrides) =>
    new Vaccine({
      petId: "p1",
      vetId: "v1",
      type: "rabies",
      name: "V8",
      appliedAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
      batchNumber: "LOT-1",
      ...overrides,
    });

  beforeEach(() => {
    vaccineRepository = { findByPetId: jest.fn() };
    usecase = new GetVaccineStatusUseCase({ vaccineRepository });
  });

  describe("quando o pet nao tem vacinas", () => {
    it("retorna status zerado", async () => {
      vaccineRepository.findByPetId.mockResolvedValue([]);
      const status = await usecase.execute("pet-sem-vacinas");
      expect(status.total).toBe(0);
      expect(status.overdue).toEqual([]);
      expect(status.upcoming).toEqual([]);
      expect(status.all).toEqual([]);
    });
  });

  describe("categorizacao em overdue e upcoming", () => {
    it("separa vacinas em atraso e proximas corretamente", async () => {
      const ontem = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const amanha = new Date(Date.now() + 24 * 60 * 60 * 1000);
      vaccineRepository.findByPetId.mockResolvedValue([
        make({ id: "v1", nextDoseAt: ontem }),
        make({ id: "v2", nextDoseAt: amanha }),
        make({ id: "v3" }),
      ]);
      const status = await usecase.execute("p1");
      expect(status.total).toBe(3);
      expect(status.overdue).toHaveLength(1);
      expect(status.overdue[0].id).toBe("v1");
      expect(status.upcoming).toHaveLength(1);
      expect(status.upcoming[0].id).toBe("v2");
    });

    it("inclui detalhes no overdue (id, type, name, dueDate)", async () => {
      const ontem = new Date(Date.now() - 24 * 60 * 60 * 1000);
      vaccineRepository.findByPetId.mockResolvedValue([
        make({
          id: "v1",
          type: "rabies",
          name: "Antirrabica",
          nextDoseAt: ontem,
        }),
      ]);
      const status = await usecase.execute("p1");
      expect(status.overdue[0]).toEqual(
        expect.objectContaining({
          id: "v1",
          type: "rabies",
          name: "Antirrabica",
          dueDate: ontem,
        }),
      );
    });

    it("inclui daysUntil no upcoming", async () => {
      const dias5 = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
      vaccineRepository.findByPetId.mockResolvedValue([
        make({ id: "v1", nextDoseAt: dias5 }),
      ]);
      const status = await usecase.execute("p1");
      expect(status.upcoming[0]).toEqual(
        expect.objectContaining({
          id: "v1",
          dueDate: dias5,
        }),
      );
      expect(status.upcoming[0].daysUntil).toBeGreaterThan(3);
      expect(status.upcoming[0].daysUntil).toBeLessThanOrEqual(5);
    });
  });

  describe("ordenacao de upcoming", () => {
    it("retorna upcoming ordenado por data crescente", async () => {
      const d10 = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
      const d20 = new Date(Date.now() + 20 * 24 * 60 * 60 * 1000);
      const d5 = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
      vaccineRepository.findByPetId.mockResolvedValue([
        make({ id: "v1", nextDoseAt: d10 }),
        make({ id: "v2", nextDoseAt: d20 }),
        make({ id: "v3", nextDoseAt: d5 }),
      ]);
      const status = await usecase.execute("p1");
      expect(status.upcoming.map((v) => v.id)).toEqual(["v3", "v1", "v2"]);
    });

    it("limita upcoming a no maximo 5 itens", async () => {
      const vaccines = Array.from({ length: 10 }, (_, i) =>
        make({
          id: `v${i}`,
          nextDoseAt: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000),
        }),
      );
      vaccineRepository.findByPetId.mockResolvedValue(vaccines);
      const status = await usecase.execute("p1");
      expect(status.upcoming).toHaveLength(5);
    });
  });

  describe('campo "all"', () => {
    it("retorna todas as vacinas no campo all", async () => {
      const vaccines = [
        make({ id: "v1" }),
        make({ id: "v2" }),
        make({ id: "v3" }),
      ];
      vaccineRepository.findByPetId.mockResolvedValue(vaccines);
      const status = await usecase.execute("p1");
      expect(status.all).toHaveLength(3);
    });
  });

  describe("validacoes", () => {
    it("rejeita sem petId", async () => {
      await expect(usecase.execute(null)).rejects.toThrow(
        "petId e obrigatorio",
      );
      await expect(usecase.execute("")).rejects.toThrow("petId e obrigatorio");
    });

    it("lanca erro sem vaccineRepository", () => {
      expect(() => new GetVaccineStatusUseCase({})).toThrow(
        "vaccineRepository e obrigatorio",
      );
    });

    it("chama findByPetId com o id correto", async () => {
      vaccineRepository.findByPetId.mockResolvedValue([]);
      await usecase.execute("pet-abc-123");
      expect(vaccineRepository.findByPetId).toHaveBeenCalledWith("pet-abc-123");
    });
  });
});
