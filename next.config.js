/** @type {import('next').NextConfig} */
//https://codingwithmanny.medium.com/3-ways-to-configure-cors-for-nextjs-13-app-router-api-route-handlers-427e10929818
const nextConfig = {
<<<<<<< HEAD
    async headers() {
        return [{
            source: "/api/contact/",
            headers: [
                {
                    key: "Access-Control-Allow-Origin",
                    value: "*",
                },
                {
                    key: "Access-Control-Allow-Methods",
                    value: "POST,GET", 
                },
            ]
      }]  
    },
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                port: '',
                
            }
        ]
    }
}
=======
  async headers() {
    return [
      {
        source: "/api/contact/",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "POST" },
          {
            key: "Access-Control-Allow-Headers",
            
            value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
      },
    ],
  },
};
>>>>>>> dev

module.exports = nextConfig;
