// import type { NextConfig } from "next";
//
// const nextConfig: NextConfig = {
//   /* config options here */
// };
//
// export default nextConfig;



/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        // 在开发过程中仍然显示ESLint错误
        ignoreDuringBuilds: true,
    },
    typescript: {
        // 在开发过程中仍然显示类型错误
        ignoreBuildErrors: true,
    },
}

module.exports = nextConfig
