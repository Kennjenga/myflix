/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      // add images url here no https
      "dx35vtwkllhj9.cloudfront.net",
      "encrypted-tbn0.gstatic.com",
    ],
  },
};

export default nextConfig;
