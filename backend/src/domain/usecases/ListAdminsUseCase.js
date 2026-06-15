class ListAdminsUseCase {
  constructor({ adminRepository, cacheGateway }) {
    if (!adminRepository) throw new Error("adminRepository e obrigatorio");
    if (!cacheGateway) throw new Error("cacheGateway e obrigatorio");
    this.adminRepository = adminRepository;
    this.cacheGateway = cacheGateway;
  }
  async execute(filters = {}) {
    const cacheKey = `admin:list:${JSON.stringify(filters)}`;

    const cached = await this.cacheGateway.get(cacheKey);
    if (cached) return JSON.parse(cached);
    const admins = await this.adminRepository.findAll(filters);
    await this.cacheGateway.set(cacheKey, JSON.stringify(admins), 60);
    return admins;
  }
}
module.exports = ListAdminsUseCase;
