/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
     images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pzbozvzqeetsozeyfepy.supabase.co",
        port: "",
      },
    ],
  },
}

module.exports = nextConfig
