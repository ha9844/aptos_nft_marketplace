const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
const withImages = require("next-images");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.arweave.net",
      },
    ],
    domains: [
      "nftstorage.link",
      "cloudflare-ipfs.com",
      "ipfs.bluemove.io",
      "avatars.githubusercontent.com",
      "ipfs.io",
      "i.ibb.co",
      "eonlabz.com",
      "bluemovecdn.s3.ap-northeast-1.amazonaws.com",
      "i.imgur.com",
      "bafybeiaeg2jrnxgjljsbz5utiz6pmwbiusmcja3ixbkma44kbx7chriv2a.ipfs.w3s.link",
      "iili.io",
      "imagedelivery.net",
      "www.vexpy.com",
      "vexpy.com",
      "res.cloudinary.com",
      "aptos-names-api-u6smh7xtla-uw.a.run.app",
      "nft.blocto.app",
      "ipfs.bluemove.net",
      "*.ipfs.nftstorage.link",
      "*.ipfs.dweb.link",
      "*.ipfs.w3s.link",
      "*.bluemove.io",
      "gateway.pinit.io",
    ],
    minimumCacheTTL: 60,
  },
  async rewrites() {
    return [
      // {
      //   source: "/collection/:slug/listed",
      //   destination: "/collection/:slug/listed", // The :path parameter is used here so will not be automatically passed in the query
      // },
      // {
      //   source: "/collection/:slug/offers",
      //   destination: "/collection/:slug/offers", // The :path parameter is used here so will not be automatically passed in the query
      // },
      // {
      //   source: "/collection/:slug/activity",
      //   destination: "/collection/:slug/activity", // The :path parameter is used here so will not be automatically passed in the query
      // },
    ];
  },
};

module.exports = nextConfig;
