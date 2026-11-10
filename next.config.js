/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.puma.com", "res.cloudinary.com"],
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "https://store-backend-0jpc.onrender.com/api/v1/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
