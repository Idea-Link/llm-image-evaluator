/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@evaluation-platform/shared', '@evaluation-platform/config'],
  reactStrictMode: true,
}

export default nextConfig