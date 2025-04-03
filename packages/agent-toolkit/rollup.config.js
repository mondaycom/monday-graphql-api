import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';
import del from 'rollup-plugin-delete';
import dts from 'rollup-plugin-dts';

const subpathConfigs = ['mcp', 'tools', 'core', 'openai'].map((dir) => ({
  input: `lib/${dir}/index.ts`,
  output: [
    {
      file: `dist/cjs/${dir}/index.js`,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: `dist/esm/${dir}/index.js`,
      format: 'es',
      sourcemap: true,
    },
  ],
  plugins: [
    del({ targets: [`dist/cjs/${dir}/*`, `dist/esm/${dir}/*`] }),
    resolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: `dist/temp/${dir}`,
      rootDir: 'lib',
    }),
    json(),
    terser(),
  ].filter(Boolean),
  external: ['@langchain/core', '@modelcontextprotocol/sdk', 'openai'],
}));

// Subpath types
const subpathTypesConfigs = ['mcp', 'tools', 'core', 'openai'].map((dir) => ({
  input: `lib/${dir}/index.ts`,
  output: [
    { file: `dist/cjs/${dir}/index.d.ts`, format: 'es' },
    { file: `dist/esm/${dir}/index.d.ts`, format: 'es' },
  ],
  plugins: [dts(), del({ targets: [`dist/cjs/${dir}/temp`, `dist/esm/${dir}/temp`] })],
}));

export default [...subpathConfigs, ...subpathTypesConfigs];
