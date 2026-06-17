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
      appliedAt: "2024-01-01",
      batchNumber: "LOT-1",
      ...overrides,
    });

  beforeEach(() => {
    vaccineRepository = { findByPetId: jest.fn() };
    usecase = new GetVaccineStatusUseCase({ vaccineRepository });
  });

  it("categoriza vacinas em overdue e upcoming", async () => {
    const ontem = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const amanha = new Date(Date.now() + 24 * 60 * 60 * 1000);
    vaccineRepository.findByPetId.mockResolvedValue([
      make({ id: "v1", nextDoseAt: ontem }),
      make({ id: "v2", nextDoseAt: amanha }),
    ]);
    const status = await usecase.execute("p1");
    expect(status.total).toBe(2);
    expect(status.overdue).toHaveLength(1);
    expect(status.overdue[0].id).toBe("v1");
    expect(status.upcoming).toHaveLength(1);
    expect(status.upcoming[0].id).toBe("v2");
  });

  it("retorna upcoming ordenado por proximidade da data", async () => {
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

  it("rejeita sem petId", async () => {
    await expect(usecase.execute(null)).rejects.toThrow("petId e obrigatorio");
  });
});
