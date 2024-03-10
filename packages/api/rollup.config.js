import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';
import del from 'rollup-plugin-delete';
import dts from 'rollup-plugin-dts';

const mainConfig = {
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
  plugins: [
    del({ targets: 'dist/*' }),
    resolve(),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json' }),
    json(),
    terser(),
  ],

  external: ['graphql-request', 'graphql-tag'],
};

const typesConfig = {
  input: 'lib/index.ts',
  output: [
    { file: 'dist/cjs/index.d.ts', format: 'es' },
    { file: 'dist/esm/index.d.ts', format: 'es' },
  ],
  plugins: [dts()],
};

export default [mainConfig, typesConfig];
