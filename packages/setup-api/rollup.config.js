import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import shebang from 'rollup-plugin-preserve-shebang';
import { terser } from 'rollup-plugin-terser';
import del from 'rollup-plugin-delete';

export default {
  input: 'lib/index.ts',
  output: [
    {
      file: 'dist/cjs/index.js',
      format: 'cjs',
      sourcemap: true,
    },
  ],
  external: ['fs', 'path', 'shelljs'],
  plugins: [
    del({ targets: 'dist/*' }),
    resolve({
      preferBuiltins: true,
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    }),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json' }),
    json(),
    shebang(),
    terser(),
  ],
};
