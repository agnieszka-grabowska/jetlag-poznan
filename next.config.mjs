/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 0,
    },
  },
  images: {
    remotePatterns: [new URL("https://ucarecdn.com/**")],
  },
};

export default nextConfig;
