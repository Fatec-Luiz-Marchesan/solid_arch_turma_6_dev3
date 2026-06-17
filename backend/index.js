const mongoose = require("mongoose");
const app = require("./src/app");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/solid_arch";
const PORT = process.env.PORT || 5000;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB conectado");
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  })
  .catch((err) => {
    console.error("Erro ao conectar MongoDB:", err);
    process.exit(1);
  });