const fs = require("fs");
const path = require("path");
const mkdirp = require("mkdirp");
const { createFilePath } = require(`gatsby-source-filesystem`);
const { reporter } = require("gatsby-cli/lib/reporter/reporter");
const extractExports = require(`gatsby-plugin-mdx/utils/extract-exports`);
const mdx = require(`gatsby-plugin-mdx/utils/mdx`);

exports.createPages = async ({ graphql, actions }, themeOptions) => {
  console.log("----------------------------- ");
  console.log("----------------------------- ");
  console.log("----------------------------- ");
  console.log(
    "----------------------------- This site is using Gatsby theme: gatsby-theme-root-prefix-route-repro"
  );
  console.log("----------------------------- ");
  console.log("----------------------------- ");
  console.log("----------------------------- ");
  const { data } = await graphql(`
    query {
      allMdx {
        nodes {
          fileAbsolutePath
          rawBody
          tableOfContents(maxDepth: 2)
          parent {
            ... on File {
              relativeDirectory
              name
            }
          }
        }
      }
    }
  `);

  // Turn every MDX file into a page.
  await Promise.all(
    data.allMdx.nodes.map(async (node) => {
      const pagePath = path
        .join(
          node.parent.relativeDirectory,
          node.parent.name === "index" ? "/" : node.parent.name
        )
        .replace(/\\/g, "/"); // Need this to convert Windows backslash paths to forward slash paths: some\\path → some/path

      const rootAbsolutePath = path.resolve(
        process.cwd(),
        themeOptions.repoRootPath || "."
      );

      const fileRelativePath = path.relative(
        rootAbsolutePath,
        node.fileAbsolutePath
      );

      // From gatsby-plugin-mdx (https://git.io/JUs3H)
      // as a workaround for https://github.com/gatsbyjs/gatsby/issues/21837
      const code = await mdx(node.rawBody);
      const { frontmatter } = extractExports(code);
      console.log("---------------------creating pages");
      actions.createPage({
        path: pagePath,
        component: node.fileAbsolutePath,
        context: {
          tableOfContents: node.tableOfContents,
          // Note: gatsby-plugin-mdx should insert frontmatter
          // for us here, and does on the first build,
          // but when HMR kicks in the frontmatter is lost.
          // The solution is to include it here explicitly.
          frontmatter,
        },
      });
    })
  );
};

// Create a new field called `slug` on the mdx field
exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  if (node.internal.type === "Mdx") {
    const slug = createFilePath({ node, getNode, basePath: `content` });
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    });
  }
};

// Check if `content` directory exists in host project docs folder, and if not, create it
exports.onPreBootstrap = ({ store }, themeOptions) => {
  const { program } = store.getState();
  const basePath = themeOptions.basePath || "content";

  const dir = path.join(program.directory, basePath);

  if (!fs.existsSync(dir)) {
    mkdirp.sync(dir);
  }
};
