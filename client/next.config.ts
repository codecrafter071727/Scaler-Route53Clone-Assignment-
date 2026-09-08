import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/hostedzones",
        destination: "/route53/v2/hostedzones",
        permanent: false,
      },
      {
        source: "/hostedzones/:path*",
        destination: "/route53/v2/hostedzones/:path*",
        permanent: false,
      },
      {
        source: "/dashboard",
        destination: "/route53/v2/dashboard",
        permanent: false,
      },
      {
        source: "/healthchecks",
        destination: "/route53/v2/healthchecks",
        permanent: false,
      },
      {
        source: "/profiles",
        destination: "/route53/v2/profiles",
        permanent: false,
      },
      {
        source: "/globalresolver/:path*",
        destination: "/route53/v2/globalresolver/:path*",
        permanent: false,
      },
      {
        source: "/vpcresolver/:path*",
        destination: "/route53/v2/vpcresolver/:path*",
        permanent: false,
      },
      {
        source: "/domains/:path*",
        destination: "/route53/v2/domains/:path*",
        permanent: false,
      },
      {
        source: "/ip-based-routing/:path*",
        destination: "/route53/v2/ipam/:path*",
        permanent: false,
      },
      {
        source: "/traffic-flow/:path*",
        destination: "/route53/v2/trafficpolicy/:path*",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
