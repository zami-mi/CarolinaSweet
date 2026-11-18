const app = require('./src/app');
const { PORT } = require('./src/config/env');
const { runSeed } = require('./src/database/seed');

// Asegurar semillas iniciales al iniciar el servidor
runSeed();

app.listen(PORT, () => {
  console.log(`🍰 Servidor Carolina Sweet ejecutándose en http://localhost:${PORT}`);
  console.log(`✨ Healthcheck disponible en http://localhost:${PORT}/api/health`);
});
