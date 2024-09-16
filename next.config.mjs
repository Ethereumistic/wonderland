/** @type {import('next').NextConfig} */
const nextConfig = {

    images: {
        formats: ["image/avif", "image/webp"],
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'nostr.build',
        port: '',
      },
    ],
  },

};

export default nextConfig;
