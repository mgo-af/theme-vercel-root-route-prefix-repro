# Minimal repro for root route prefixing with Gatsby, yarn workspaces, and Vercel deployments

### How to use

1. `git clone`
2. `cd vercel-root-route-prefix-repro`
3. `yarn` from project root
4. `yarn start` from project root -- this will open the `/docs` site in this project, which is an example that has the theme installed

### Project structure:

## `/theme`

Gatsby theme that includes the SSG logic and does all the work.

`gatsby-node.js` file builds each page; instructs consuming sites to house MDX files in a `/content` folder, if none exists, create that folder.

The logic in `gatsby-node.js` is all contained in the `createPages` function.

In addition to telling consuming sites how to build MDX pages, the `theme` exports a single component to be used by consuming sites, a `Layout` component, from `/src/components/Layout`.

Includes some dependencies for the Gatsby API's to build MDX pages and read from file structure.

## `/docs`

Example site that ships with the theme package.

`gatsby-config.js` demonstrates that `gatsby-theme-root-prefix-route-repro` is installed.

Renders a single page, from `/content/index.mdx`.

When you run `yarn start` from local project root, this is the page that renders.
