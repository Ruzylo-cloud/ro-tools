/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    // Required on Next.js 14 so instrumentation.js is loaded at boot.
    // Runs src/lib/notification-prefs#forceDisableAllProfiles once per
    // container to enforce the 2026-04-13 "all channels off" directive.
    instrumentationHook: true,
  },
};

export default nextConfig;
