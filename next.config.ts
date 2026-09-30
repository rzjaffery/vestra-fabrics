import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // experimental :{
    //     turbopackImportTypeBytes: true
    // },

    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
        ],
    },
};

export default nextConfig;
