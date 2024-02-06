import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json'; // Import the plugin

// Determine if we are in a production environment
// const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'lib/index.ts', // Your main TypeScript entry point
  output: [
    {
      file: 'dist/cjs/index.js',
      format: 'cjs', // CommonJS, for Node, could also be 'amd', 'esm', 'iife', 'umd'
      sourcemap: true,
    },
    {
      file: 'dist/esm/index.js',
      format: 'es', // ES module, for bundlers
      sourcemap: true,
    },
  ],
  plugins: [
    resolve(), // tells Rollup how to find external modules
    commonjs(), // converts CommonJS modules to ES6
    typescript(), // compiles TypeScript to JavaScript
    json(),
    // production && terser(), // minify, but only in production
  ],
};
