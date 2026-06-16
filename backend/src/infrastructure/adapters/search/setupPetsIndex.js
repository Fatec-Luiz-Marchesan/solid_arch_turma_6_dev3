const { getESClient } = require("./elasticsearchClient");

async function setupPetsIndex() {
  const client = getESClient();
  const INDEX = "pets";

  const exists = await client.indices.exists({ index: INDEX });
  if (exists) {
    console.log(`[ES] Índice '${INDEX}' já existe.`);
    return;
  }

  await client.indices.create({
    index: INDEX,
    mappings: {
      properties: {
        name: {
          type: "text",
          analyzer: "standard",
          fields: { keyword: { type: "keyword" } },
        },
        species: { type: "keyword" },
        breed: { type: "keyword" },
        city: { type: "keyword" },
        age: { type: "integer" },
        status: { type: "keyword" },
        description: { type: "text", analyzer: "portuguese" },
        ownerId: { type: "keyword" },
        createdAt: { type: "date" },
      },
    },
    settings: {
      number_of_shards: 1,
      number_of_replicas: 0,
    },
  });

  console.log(`[ES] Índice '${INDEX}' criado com sucesso.`);
}

setupPetsIndex().catch(console.error);
