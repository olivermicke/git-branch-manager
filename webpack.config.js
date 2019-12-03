module.exports = {
  entry: './src/index.tsx',
  output: {
    filename: 'git-branch-manager.js',
    path: __dirname + '/dist',
  },
  target: 'node',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  module: {
    rules: [
      {
        test: [/\.tsx?$/],
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
};
