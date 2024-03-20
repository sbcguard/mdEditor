import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import replace from '@rollup/plugin-replace';
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
        react: 'React',
        'react-dom': 'ReactDOM',
      },
    },
  ],
  plugins: [
    typescript(), // Handle TypeScript files
    resolve(), // Resolve module imports
    commonjs(), // Convert CommonJS modules to ES modules
    postcss({
      modules: true, // Enable CSS Modules
      extract: true, // Extract CSS to a separate file
      minimize: true, // Minify CSS
      extensions: ['.css'], // Process CSS files
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
    //terser(), // Optionally minify the output
  ],
  external: [], // Specify external modules to exclude from the bundle
};
