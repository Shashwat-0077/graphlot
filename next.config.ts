import path from 'path';

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    { key: 'X-Frame-Options', value: 'ALLOWALL' },
                    {
                        key: 'Content-Security-Policy',
                        value: 'frame-ancestors *;',
                    },
                ],
            },
        ];
    },

    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                port: '',
                pathname: '/**',
            },
        ],
    },

    webpack: (config) => {
        config.resolve.alias['graphql'] = path.resolve(__dirname, 'node_modules/graphql');
        return config;
    },
};

export default nextConfig;
