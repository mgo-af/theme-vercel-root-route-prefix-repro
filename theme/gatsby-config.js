const path = require("path");

module.exports = (themeOptions) => ({
  siteMetadata: {
    title: "Vercel root route & proxy demo",
    siteName: "Vercel root route & proxy demo",
    description:
      "A Gatsby theme to demo Vercel deployments, root route prefixing, and proxying.",
  },
  plugins: [
    `gatsby-transformer-yaml`,
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [".mdx", ".md"],
        defaultLayouts: {
          default: require.resolve("./src/components/Layout.js"),
        },
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: themeOptions.contentPath || `./content`,
      },
    },
  ],
});
