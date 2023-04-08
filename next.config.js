/** @type {import('next').NextConfig} */
module.exports = {
  // To support docker.
  output: 'standalone',
  reactStrictMode: true,
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true
  }
}