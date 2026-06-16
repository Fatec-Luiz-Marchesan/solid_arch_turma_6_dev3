const { Client } = require("@elastic/elasticsearch");

let client = null;

function getESClient() {
  if (client) return client;
  client = new Client({
    node: process.env.ELASTICSEARCH_URL || "http://localhost:9200",
    auth: process.env.ELASTICSEARCH_USERNAME
      ? {
          username: process.env.ELASTICSEARCH_USERNAME,
          password: process.env.ELASTICSEARCH_PASSWORD || "",
        }
      : undefined,
    maxRetries: 3,
    requestTimeout: 10000,
    sniffOnStart: false,
  });
  return client;
}

async function closeESClient() {
  if (client) {
    await client.close();
    client = null;
  }
}

module.exports = { getESClient, closeESClient };
