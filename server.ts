import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;
  const PHOTOS_DIR = path.join(process.cwd(), "photos");

  // Garantir que a pasta de fotos exista
  if (!fs.existsSync(PHOTOS_DIR)) {
    fs.mkdirSync(PHOTOS_DIR);
    console.log("Pasta 'photos' criada.");
  }

  // API para listar fotos
  app.get("/api/photos", (req, res) => {
    try {
      const files = fs.readdirSync(PHOTOS_DIR);
      const photos = files
        .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
        .map(file => ({
          id: file,
          url: `/local-photos/${file}`,
          name: file
        }));
      res.json(photos);
    } catch (error) {
      res.status(500).json({ error: "Erro ao ler pasta de fotos" });
    }
  });

  // Servir as fotos estaticamente
  app.use("/local-photos", express.static(PHOTOS_DIR));

  // Middleware do Vite para desenvolvimento
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`LumiFrame rodando em http://localhost:${PORT}`);
    console.log(`Coloque suas fotos na pasta: ${PHOTOS_DIR}`);
  });
}

startServer();
