const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: false, // Disable PWA in development to avoid GenerateSW warnings
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlineCache',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
        }
      }
    }
  ],
  buildExcludes: [/middleware-manifest.json$/],
  scope: '/',
  sw: 'sw.js'
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    webVitalsAttribution: ['CLS', 'LCP']
  },
  webpack: (config, { dev, isServer }) => {
    // Only apply optimizations in development and avoid vendor chunk issues
    if (dev) {
      // Optimize webpack cache to reduce serialization warnings
      config.cache = {
        type: 'filesystem',
        compression: 'gzip',
        buildDependencies: {
          config: [__filename]
        }
      }
      
      // Simplified optimization to avoid exports issues
      if (!isServer) {
        config.optimization = {
          ...config.optimization,
          splitChunks: {
            chunks: 'async', // Changed from 'all' to 'async' to avoid vendor chunk issues
            cacheGroups: {
              default: false,
              vendors: false,
            },
          },
        }
      }
    }
    
    return config
  },
  headers: async () => {
    return [
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json'
          }
        ]
      }
    ]
  }
}

module.exports = withPWA(nextConfig)
