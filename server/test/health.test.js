const { test, describe } = require('node:test');
const assert = require('node:assert');
const app = require('../src/app');

describe('API Health Check', () => {
  test('GET /api/health retorna 200 y status ok', async () => {
    const server = app.listen(0);
    const port = server.address().port;

    try {
      const response = await fetch(`http://localhost:${port}/api/health`);
      const data = await response.json();

      assert.strictEqual(response.status, 200);
      assert.strictEqual(data.status, 'ok');
      assert.strictEqual(data.app, 'Carolina Sweet API');
      assert.ok(typeof data.timestamp === 'string');
    } finally {
      server.close();
    }
  });

  test('GET /api/ruta-inexistente retorna 404', async () => {
    const server = app.listen(0);
    const port = server.address().port;

    try {
      const response = await fetch(`http://localhost:${port}/api/ruta-inexistente`);
      assert.strictEqual(response.status, 404);
    } finally {
      server.close();
    }
  });
});
