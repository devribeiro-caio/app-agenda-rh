const express = require("express");
const cors = require("cors");
const connectDatabase = require("./db");
const { port } = require("./config");
const processRoutes = require("./routes/processes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("src/renderer"));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/processes", processRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  const status = error.name === "ValidationError" ? 400 : 500;
  res.status(status).json({ message: error.message || "Erro interno do servidor" });
});

async function start() {
  await connectDatabase();
  app.listen(port, () => {
    console.log(`API Agenda RH em http://localhost:${port}`);
  });
}

if (require.main === module) {
  start().catch((error) => {
    console.error("Falha ao iniciar servidor", error);
    process.exit(1);
  });
}

module.exports = app;
