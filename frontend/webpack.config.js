
// webpack.config.js
const path = require("path");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
module.exports = {
  entry: "./src/index.js", // Entry point of your application
  output: {
    path: path.resolve(__dirname, "dist"), // Output directory for bundled files
    filename: "bundle.js", // Output filename
  },
  module: {
    rules: [
      // Add rules for processing JavaScript files, CSS files, etc.
    ],
  },
  resolve: {
    fallback: {
      path: false,
    },
  },

  plugins: [new NodePolyfillPlugin()],
};
