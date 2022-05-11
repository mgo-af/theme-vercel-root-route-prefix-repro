# Minimal repro for root route prefixing with Gatsby, yarn workspaces, and Vercel deployments: theme

### What is this

An extremely minimal Gatsby theme to demonstrate working with prefix-paths and root route redirects in Vercel.

### Why

A Gatsby theme allows us to bootstrap a site in the `/docs` directory in projects we're building.

We want to make our deployed docs sites available at `parentproject.com/docs-site-name`, where `docs-site-name` is the name of a docs site bootstrapped using the theme.

### What we want to happen

A website at `parentproject.com`, can reference the site at `parentproject.com/vercelredirects` by setting the values in the `rewrites` array in `parentproject.com`'s `vercel.json` file, so that a path like `parentproject.com/vercelredirects/page-2` points at the site built at `vercelredirects`, and paths at that site find the correct files in the build directory.

### What should happen

Defining a route in `vercel.json` that proxies `/docs-site-name/*` to `/*` should mean that behind the scenes, a path like `/docs-site-name/page-2` will find `/page-2.html` in the build directory.

### What is currently happening

In Vercel, we set the Root directory for this project to be `docs`. The build command runs the build command as expected.

Navigating to a path like `/docs-site-name/page-2` results in a 404, because there's a mismatch between the links on the site and the actual paths to the files.

### What have you tried

To create the path aliasing/redirect behavior we want (e.g., `/` redirects to `/docs-site-name`), in the consuming site's `gatsby-config.js` file, we set a `--prefix-paths` flag in the build script:

```
// package.json

"scripts":  {
  "build": "gatsby build --prefix-paths"
}

```

For the purposes of this demonstration, we're calling setting the value of our prefix path to `vercelredirects`, and instructing Gatsby to use that for the `/docs` directory in its `gatsby-config.js` file:

```
// gatsby-config.js in /docs:

module.exports = {
  pathPrefix: "/vercelredirect",
  plugins: [
    {
      resolve: `gatsby-theme-root-prefix-route-repro`,
      options: {},
    },
  ],
};

```

In `vercel.json`, we've tried using the `redirects` and `rewrites` properties....

### How to use this directory

1. `git clone`
2. `cd theme-vercel-root-route-prefix-repro`
3. `yarn` from project root
4. `yarn start` from project root -- this will open the `/docs` site in this project, which is an example that has the theme installed
5. Navigate from `localhost:8000` to `localhost:8000/page-2` and note that the site builds and functions properly locally.

### Project structure:

```.
├── README.md
├── docs
│   ├── content
│   │   ├── index.mdx
│   │   └── page-2.mdx
│   ├── gatsby-config.js
│   ├── package.json
├── package.json
├── theme
│   ├── gatsby-config.js
│   ├── gatsby-node.js
│   ├── index.js
│   ├── package.json
│   └── src
│       └── components
│           └── Layout
└── yarn.lock
```

#### `/theme`

Gatsby theme that includes the SSG logic and does all the work.

`gatsby-node.js` file builds each page; instructs consuming sites to house MDX files in a `/content` folder, if none exists, create that folder. Each `.mdx` file is turned into a page.

The logic in `gatsby-node.js` is all contained in the `createPages` function.

In addition to telling consuming sites how to build MDX pages, the `theme` exports a single component to be used by consuming sites, a `Layout` component, from `/src/components/Layout`. There are basic global styles applied using standard CSS in `Layout.css`, just to demonstrate that the theme is being consumed by sites in which it is installed.

Includes a small handful of dependencies for the Gatsby API's to build MDX pages and read from file structure.

#### `/docs`

Example site that ships with the theme package.

`gatsby-config.js` demonstrates that `gatsby-theme-root-prefix-route-repro` is installed.

Renders a single page, from `/content/index.mdx`.

When you run `yarn start` from local project root, this is the page that renders.
