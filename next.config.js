const allowed = process.env.ALLOW_ORIGIN || "https://creativerafa.com,https://shops.creativerafa.com,http://localhost:3000/"
/** @type {import('next').NextConfig} */
//https://codingwithmanny.medium.com/3-ways-to-configure-cors-for-nextjs-13-app-router-api-route-handlers-427e10929818
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
      },
    ],
    qualities: [75, 85], // 🔧 Soportar quality 85 además de 75
  },
};

module.exports = nextConfig;
