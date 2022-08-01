import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: "src/index.ts",

  output: [
    {
      format: "esm",
      dir: "dist/esm",
    },
  ],
  plugins: [
    resolve({ extensions: [".js", ".jsx", ".ts", ".tsx"] }),
    commonjs({ include: /node_modules/ }),
    babel({
      extensions: [".js", ".jsx", ".ts", ".tsx"],
      include: ["src/**"],
      babelHelpers: "runtime",
    }),
  ],
};
export default config;
