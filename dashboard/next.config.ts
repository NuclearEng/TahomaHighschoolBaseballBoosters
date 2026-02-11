import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/TahomaHighschoolBaseballBoosters",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
