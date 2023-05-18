import { defineConfig } from "rollup";
import swc from "@rollup/plugin-swc";
import { nodeResolve } from "@rollup/plugin-node-resolve";
// import commonjs from '@rollup/plugin-commonjs';

export default defineConfig({
  input: "src/index.ts",
  output: {
    dir: "lib",
    // format: 'cjs'
  },
  plugins: [
    nodeResolve({
      extensions: [".ts"],
      preferBuiltins: false
    }),
    swc(),
    // commonjs({
    //   include: /node_modules/,
    //   requireReturnsDefault: 'auto'
    // })
  ],
});
