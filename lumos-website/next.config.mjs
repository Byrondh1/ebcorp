/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/lumos-paola',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

export default nextConfig
