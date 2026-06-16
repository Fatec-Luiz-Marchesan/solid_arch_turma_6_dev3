class SearchPetsUseCase {
  constructor({ searchGateway }) {
    if (!searchGateway) throw new Error("searchGateway é obrigatório");
    this.searchGateway = searchGateway;
  }

  async execute({ q, species, city, page = 1, limit = 20 } = {}) {
    if (limit < 1 || limit > 100) {
      throw new Error("limit deve estar entre 1 e 100");
    }

    const mustClauses = [];
    const filterClauses = [{ term: { status: "available" } }];

    if (q && q.trim().length > 0) {
      mustClauses.push({
        multi_match: {
          query: q.trim(),
          fields: ["name^3", "description"],
          fuzziness: "AUTO",
          operator: "and",
        },
      });
    }

    if (species) filterClauses.push({ term: { species } });
    if (city) filterClauses.push({ term: { city } });

    const query =
      mustClauses.length > 0
        ? { bool: { must: mustClauses, filter: filterClauses } }
        : { bool: { filter: filterClauses } };

    const result = await this.searchGateway.search("pets", query, {
      from: (page - 1) * limit,
      size: limit,
    });

    return {
      pets: result.hits,
      total: result.total,
      page,
      limit,
      totalPages: Math.ceil(result.total / limit),
    };
  }
}

module.exports = SearchPetsUseCase;
