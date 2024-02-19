import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';

export default {
  input: 'lib/index.ts',
  output: [
    {
      file: 'dist/cjs/index.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/esm/index.js',
      format: 'es',
      sourcemap: true,
    },
  ],
  plugins: [resolve(), commonjs(), typescript({ tsconfig: './tsconfig.json' }), json(), terser()],

  external: ['graphql-request', 'graphql-tag'],
};
