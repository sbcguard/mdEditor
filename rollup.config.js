import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import replace from '@rollup/plugin-replace';
import del from 'rollup-plugin-delete';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.ts', // Entry point of your TypeScript code
  output: [
    {
      file: 'dist/cjs/min/mdEditor.min.js',
      format: 'cjs', // CommonJS format
      sourcemap: true,
      name: 'MarkdownEditor',
      plugins: [terser()], //minify code
    },
    {
      file: 'dist/esm/min/mdEditor.min.js',
      format: 'es', // ES module format
      sourcemap: true,
      name: 'MarkdownEditor',
      plugins: [terser()], //minify code
    },
    {
      name: 'mdEditor', // UMD name
      file: 'dist/umd/min/mdEditor.min.js',
      format: 'umd', // UMD format
      sourcemap: true,
      name: 'MarkdownEditor',
      globals: {
        // Specify global variable names for external modules
        react: 'React',
        'react-dom': 'ReactDOM',
      },
      plugins: [terser()], //minify code
    },
    {
      file: 'dist/cjs/mdEditor.js',
      format: 'cjs', // CommonJS format
      sourcemap: true,
      name: 'MarkdownEditor',
    },
    {
      file: 'dist/esm/mdEditor.js',
      format: 'es', // ES module format
      sourcemap: true,
      name: 'MarkdownEditor',
    },
    {
      name: 'mdEditor', // UMD name
      file: 'dist/umd/mdEditor.js',
      format: 'umd', // UMD format
      sourcemap: true,
      name: 'MarkdownEditor',
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
      preventAssignmentErrors: true, // Disable
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    }),
    del({
      targets: ['dist/**/*.d.ts'], //excludes type definition files from production build
    }),
  ],
  external: [], // Specify external modules to exclude from the bundle
};
