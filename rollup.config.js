import babel from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import banner from './src/banner.js';

const NAME = 'Rating';
const FILENAME = 'mr-rating';

export default [
  {
    input: 'src/index.js',
    output: [
      {
        file: `dist/${FILENAME}.esm.js`,
        format: 'es'
      },
      {
        file: `dist/${FILENAME}.cjs.js`,
        format: 'cjs'
      },
      {
        banner: banner,
        name: NAME,
        file: `dist/${FILENAME}.js`,
        format: 'iife'
      },
      {
        banner: banner,
        name: NAME,
        file: `dist/${FILENAME}.min.js`,
        format: 'iife',
        plugins: [terser()]
      }
    ],
    plugins: [
      resolve(),
      babel({
        babelHelpers: 'bundled',
        presets: [
          ['@babel/preset-env', {
            targets: 'defaults, iOS >= 13, Safari >= 13'
          }]
        ]
      })
    ]
  },
  {
    input: 'src/index.scss',
    output: {
      file: `dist/${FILENAME}.css`,
    },
    plugins: [
      postcss({
        extract: true
      })
    ]
  },
  {
    input: 'src/index.scss',
    output: {
      file: `dist/${FILENAME}.min.css`
    },
    plugins: [
      postcss({
        extract: true,
        minimize: true
      })
    ]
  }
];
