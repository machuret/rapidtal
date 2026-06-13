/** @type {import('next').NextConfig} */
const nextConfig = {
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
      // NOTE: /api/* is intentionally NOT cached. These routes return
      // per-user, auth-scoped data and mutation responses — caching them
      // at a shared CDN would leak one user's data to another.
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

  // Permanent redirects
  async redirects() {
    return [
      // The quiz lives at /calculator — keep the old /quiz URL working (SEO 301).
      { source: '/quiz', destination: '/calculator', permanent: true },
    ];
  },
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // canvas is an optional native dep of pdfjs-dist — not needed in serverless
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
