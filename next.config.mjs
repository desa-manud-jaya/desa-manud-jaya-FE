/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kvnsbatzpsbrocyinnpy.supabase.co",
      },
    ],
  },
}


export default nextConfig
