import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/play/tika",
        destination: "/play/zoom",
        permanent: true,
      },
      {
        source: "/play/cap-stamping",
        destination: "/play/cap",
        permanent: true,
      },
      {
        source: "/play/sortir-peta",
        destination: "/play/map",
        permanent: true,
      },
      {
        source: "/play/tebak-motif",
        destination: "/play/guess",
        permanent: true,
      },
      {
        source: "/play/batik-zoom",
        destination: "/play/zoom",
        permanent: true,
      },
      {
        source: "/play/batik-cap",
        destination: "/play/cap",
        permanent: true,
      },
      {
        source: "/play/batik-map",
        destination: "/play/map",
        permanent: true,
      },
      {
        source: "/play/batik-guess",
        destination: "/play/guess",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
