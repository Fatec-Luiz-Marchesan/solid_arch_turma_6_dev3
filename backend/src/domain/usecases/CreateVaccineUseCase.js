const Vaccine = require("../entities/Vaccine");

class CreateVaccineUseCase {
  constructor({ vaccineRepository }) {
    if (!vaccineRepository) throw new Error("vaccineRepository e obrigatorio");
    this.vaccineRepository = vaccineRepository;
  }
  async execute(input) {
    const vaccine = new Vaccine(input);
    return this.vaccineRepository.create({
      petId: vaccine.petId, vetId: vaccine.vetId, type: vaccine.type,
      name: vaccine.name, appliedAt: vaccine.appliedAt,
      nextDoseAt: vaccine.nextDoseAt, batchNumber: vaccine.batchNumber,
      manufacturer: vaccine.manufacturer, notes: vaccine.notes,
    });
  }
}
class GetVaccineStatusUseCase {
  constructor({ vaccineRepository }) { if (!vaccineRepository) throw new Error("vaccineRepository e obrigatorio"); this.vaccineRepository = vaccineRepository; }
  async execute(petId) {
    if (!petId) throw new Error("petId e obrigatorio");
    const vaccines = await this.vaccineRepository.findByPetId(petId);
    const overdue = vaccines.filter((v) => v.isOverdue());
    const upcoming = vaccines.filter((v) => !v.isOverdue() && v.nextDoseAt).sort((a, b) => a.nextDoseAt - b.nextDoseAt);
    return { total: vaccines.length, overdue: overdue.map((v) => ({ id: v.id, type: v.type, name: v.name, dueDate: v.nextDoseAt })), upcoming: upcoming.slice(0, 5).map((v) => ({ id: v.id, type: v.type, name: v.name, dueDate: v.nextDoseAt, daysUntil: v.daysUntilNextDose() })), all: vaccines };
  }
}
module.exports = { CreateVaccineUseCase, GetVaccineStatusUseCase };
