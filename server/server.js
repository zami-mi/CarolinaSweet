const app = require('./src/app');
const { PORT } = require('./src/config/env');

app.listen(PORT, () => {
  console.log(`🍰 Servidor Carolina Sweet ejecutándose en http://localhost:${PORT}`);
  console.log(`✨ Healthcheck disponible en http://localhost:${PORT}/api/health`);
});
