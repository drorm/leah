import type { Configuration } from 'webpack';

module.exports = {
  entry: {
    background: { import: 'src/background.ts', runtime: false },
    content: { import: 'src/content.ts', runtime: false },
  },
//  devtool: 'inline-source-map'
} as Configuration;
