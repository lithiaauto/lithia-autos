import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'ui-avatars.com' },
      { protocol: 'https', hostname: 'logowik.com' },
      { protocol: 'https', hostname: 'encrypted-tbn0.gstatic.com' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'hips.hearstapps.com' },
      { protocol: 'https', hostname: 'abgiindore.in' },
      { protocol: 'https', hostname: 'cdn.mos.cms.futurecdn.net' },
      { protocol: 'https', hostname: 'gmauthority.com' },
      { protocol: 'https', hostname: 'ravidreams.net' },
      { protocol: 'https', hostname: 's.yimg.com' },
      { protocol: 'https', hostname: 'www.autoblog.com' },
      { protocol: 'https', hostname: 'media.carsandbids.com' },
      { protocol: 'https', hostname: 'www.carscoops.com' },
      { protocol: 'https', hostname: 'static0.carbuzzimages.com' },
      { protocol: 'https', hostname: 'static0.topspeedimages.com' },
      { protocol: 'https', hostname: 'autoconpumps.in' },
      { protocol: 'https', hostname: 'storage.googleapis.com' },
      { protocol: 'https', hostname: 'example.com' }
    ],
  },
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/admin',
        permanent: true,
      },
      {
        source: '/admin/blog/',
        destination: '/admin/blog',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.lithiaautos.com',
          },
        ],
        destination: 'https://lithiaautos.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
