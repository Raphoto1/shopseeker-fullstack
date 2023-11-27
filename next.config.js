/** @type {import('next').NextConfig} */
//https://codingwithmanny.medium.com/3-ways-to-configure-cors-for-nextjs-13-app-router-api-route-handlers-427e10929818
const nextConfig = {
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

module.exports = nextConfig
