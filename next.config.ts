import type { NextConfig } from "next";

const nextConfig: NextConfig = {

    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**", // Accepts all HTTPS images across the entire internet
            },
            {
                protocol: "http",
                hostname: "**", // Accepts all HTTP images
            },
        ],
        unoptimized:true
    },
};

export default nextConfig;
