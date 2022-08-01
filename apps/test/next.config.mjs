import withBA from "@next/bundle-analyzer";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // externalDir: true,
    esmExternals: true,
  },
  typescript: { ignoreBuildErrors: true },
  webpack: (config, { isServer, defaultLoaders }) => {
    if (!isServer) {
      config.optimization.providedExports = true;
    }
    // config.module.rules.push({
    //   test: /\.(tsx|ts|js|cjs|mjs|jsx)$/,
    //   exclude: /node_modules/,
    //   use: defaultLoaders.babel,
    //   type: "javascript/auto",
    //   sideEffects: false,
    // });
    return config;
  },
};

export default withBA({ enabled: true })(nextConfig);
