/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'header', key: "host", value: 'www.intellify.cz' }],
        destination: 'https://intellify.cz/:path*',
        permanent: true
      }
    ]
  },
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true
  }
}