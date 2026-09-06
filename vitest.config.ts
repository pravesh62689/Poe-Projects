import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Run tests in Node.js environment
  },
  resolve: {
    alias: {
      // Mock the sql-wasm.wasm import in Vitest/Node.js so engine.ts falls back to standard initSqlJs()
      'sql.js/dist/sql-wasm.wasm': new URL('./sql-bot/test/__mocks__/wasm-stub.ts', import.meta.url)
        .pathname
        .replace(/^\/([A-Z]:)/, '$1'), // Fix Windows path: /C: -> C:
    },
  },
});
