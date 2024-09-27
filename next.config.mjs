/** @type {import('next').NextConfig} */
const nextConfig = {
  serverRuntimeConfig: {
    // Will only be available on the server side
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
  },
  images: {
    domains: [
      // add images url here no https
      "dx35vtwkllhj9.cloudfront.net",
      "encrypted-tbn0.gstatic.com",
    ],
  },
};

export default nextConfig;
