const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const distFolder = 'dist/';
const fileName = 'index.js';

module.exports = {
  mode: "production",
  entry: "./lib/pdf417.js",
  output: {
    libraryTarget: "commonjs2",
    path: path.resolve(__dirname, distFolder),
    filename: fileName,
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        path.resolve(__dirname, "README.md"),
        path.resolve(__dirname, "LICENSE"),
        {
            from: path.resolve(__dirname, "package.json"),
            transform(content, absoluteFrom) {
                const package = JSON.parse(content);
                package.main = fileName;
                package.name = "@libusoftcicom/" + package.name,
                delete package.directories;
                return Buffer.from(JSON.stringify(package, null, 4));
            }
        }
        
      ],
    }),
  ],
};
