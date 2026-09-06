import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Run tests in Node.js environment (default)
  },
  resolve: {
    alias: {
      // In Vitest/Node.js, .wasm module imports aren't supported.
      // Mock the sql-wasm.wasm import to undefined so engine.ts falls back to initSqlJs().
      'sql.js/dist/sql-wasm.wasm': new URL('./test/__mocks__/wasm-stub.ts', import.meta.url)
        .pathname
        .replace(/^\/([A-Z]:)/, '$1'), // Fix Windows path: /C: → C:
    },
  },
});
