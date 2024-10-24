// import CopyWebpackPlugin from "copy-webpack-plugin";
// import path from "path";

// eslint-disable-next-line @typescript-eslint/no-var-requires
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'

export const plugins = [
  new ForkTsCheckerWebpackPlugin({
    logger: 'webpack-infrastructure',
  }),
  // new CopyWebpackPlugin({
  //   patterns: [
  //     {
  //       from: path.resolve(__dirname, "src/assets"),
  //       to: path.resolve(__dirname, ".webpack/main/assets"),
  //     },
  //   ],
  // }),
]
