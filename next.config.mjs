/** @type {import('next').NextConfig} */
const nextConfig = {
  // Lint runs as an explicit CI step via `pnpm lint`.
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Enable compression for better performance
  compress: true,
  
  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Experimental optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns'],
    scrollRestoration: true,
  },
  
  // Headers for caching and security
  async headers() {
    return [
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'private, no-store',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Native canvas bindings are not needed by the serverless application.
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
    };

    // Optimize bundle size
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }
    
    return config;
  },
  
  // Power by headers
  poweredByHeader: false,
};

export default nextConfig;
