/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ["page.tsx", "page.ts", "page.jsx", "page.js"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "air-bnb-clone-luka.s3.eu-central-1.amazonaws.com",
      },
    ],
  },
}

module.exports = nextConfig
