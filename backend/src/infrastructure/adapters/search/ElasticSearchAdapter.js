const ISearchGateway = require("../../../domain/ports/ISearchGateway");

class ElasticSearchAdapter extends ISearchGateway {
  constructor(client) {
    super();
    if (!client)
      throw new Error("ElasticSearchAdapter requer instância de client");
    this.client = client;
  }

  async index(index, id, body) {
    await this.client.index({
      index,
      id,
      document: body,
      refresh: "wait_for",
    });
  }

  async search(index, query, { from = 0, size = 20 } = {}) {
    const result = await this.client.search({
      index,
      from,
      size,
      query,
      highlight: {
        fields: {
          name: {},
          description: {},
        },
      },
    });

    return {
      hits: result.hits.hits.map((hit) => ({
        id: hit._id,
        score: hit._score,
        highlight: hit.highlight,
        ...hit._source,
      })),
      total: result.hits.total.value,
    };
  }

  async delete(index, id) {
    try {
      await this.client.delete({ index, id });
    } catch (err) {
      if (err.statusCode !== 404) throw err;
    }
  }
}

module.exports = ElasticSearchAdapter;
