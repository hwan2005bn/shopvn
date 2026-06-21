import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cho phép truy cập từ IP LAN trong dev mode
  allowedDevOrigins: ['192.168.1.3', '192.168.1.2', '192.168.1.4'],

  /* config options here */
};

export default nextConfig;
