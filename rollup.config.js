import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
//import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.ts', // Entry point of your TypeScript code
  output: [
    {
      file: 'dist/cjs/index.js',
      format: 'cjs', // CommonJS format
      sourcemap: false,
    },
    {
      file: 'dist/esm/index.js',
      format: 'es', // ES module format
      sourcemap: false,
    },
    {
      name: 'mdEditor', // UMD name
      file: 'dist/umd/index.js',
      format: 'umd', // UMD format
      sourcemap: false,
      globals: {
        // Specify global variable names for external modules
        '@fortawesome/free-solid-svg-icons': 'freeSolidSvgIcons',
      },
    },
  ],
  plugins: [
    typescript(), // Handle TypeScript files
    resolve(), // Resolve module imports
    commonjs(), // Convert CommonJS modules to ES modules
    //terser(), // Optionally minify the output
  ],
  external: ['@fortawesome/free-solid-svg-icons'], // Specify external modules to exclude from the bundle
};
