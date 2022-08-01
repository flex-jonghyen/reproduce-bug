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
  external: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    "@flex-components/simple-components",
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
