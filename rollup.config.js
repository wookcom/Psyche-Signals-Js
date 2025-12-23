import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.js',

  output: [
    {
      file: 'dist/psyche.esm.js',
      format: 'esm',
      sourcemap: true
    },
    {
      file: 'dist/psyche.cjs.js',
      format: 'cjs',
      exports: 'default',
      sourcemap: true
    },
    {
      file: 'dist/psyche.umd.js',
      format: 'umd',
      name: 'Psyche',
      sourcemap: true
    }
  ],

  plugins: [
    resolve()
  ]
};