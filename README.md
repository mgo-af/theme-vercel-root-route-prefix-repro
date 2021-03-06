# Minimal repro for root route prefixing with Gatsby, yarn workspaces, and Vercel deployments: theme

### What is this

An extremely minimal Gatsby theme to demonstrate working with path aliasing and root route redirects in Vercel.

### Why

A Gatsby theme allows us to bootstrap a site in the `/docs` directory in projects we're building.

We want to make our deployed docs sites available at `parentproject.com/docs-site-name`, where `docs-site-name` is the name of a docs site bootstrapped using the theme.

It's not working as expected, and our theory is that this is somehow related to our `vercel.json` configuration.

### What we want to happen

A website at `parentproject.com`, can reference the site at `parentproject.com/docs-site-name` by setting the values in the `rewrites` array in `parentproject.com`'s (that is, its own) `vercel.json` file, so that a path like `parentproject.com/docs-site-name/page-2` points at the site built at `vercelredirects`, and paths at that site find the correct files in the build directory at the site being proxied.

### What should happen

Defining a route in `vercel.json` that proxies `/docs-site-name/*` to `/*` should mean that behind the scenes, a path like `/docs-site-name/page-2` will find `/page-2.html` in the build directory.

Instructing Vercel to redirect should allow the root route `/` at the deployment for the child site to redirect to a path alias, e.g. `/docs-site-name`; furthermore, parentsite.com/docs-site-name should proxy the deployed site as well.

In order to make that work, we need each deployed site that we intend to proxy to be available at a path alias; that's not working yet.

### What is currently happening

![](https://media.giphy.com/media/iEaCrjL4efsIUfH4ck/giphy.gif)

✅ In Vercel, we set the Root directory for this project to be `docs`. The build command runs the build command as expected, and we can successfully deploy to Vercel.

❌ The root route path in the deployment is _not_ redirecting from `/` to the proxy path (for the purposes of this demo, `/vercelredirects`). [This is confirmed by observing the contents of vercel.json, and by observing the URL when navigating to the deployment at root route, https://theme-vercel-root-route-prefix-repro.vercel.app](https://theme-vercel-root-route-prefix-repro.vercel.app). **_*Our theory is that this is related to our settings in `vercel.json`.*_**

✅ Gatsby's `--prefix-path` build command successfully points to the path alias (for the purposes of this demo, that `/vercelredirects`). [This is confirmed by observing the Vercel build directory, the `/docs` subdirectory build command in package.json, and observing the URL when navigating to the deployment, and when clicking on the link to `/page-2`](https://theme-vercel-root-route-prefix-repro.vercel.app/vercelredirect/page-2). Observe that `vercelredirect` is pushed onto the path for the built and deployed site.

❌ Navigating to a path like `/docs-site-name/page-2` results in a 404, presumably because there's a mismatch between the links on the site and the actual paths to the files. **_*Our theory is that this is related to our settings in `vercel.json`.*_**

✅ If we house `vercel.json` in `/docs` and use the deprecated `routes` API, we get the root route redirect and aliasing behavior we want.

### What have you done so far

1. _Set up the alias path_
   To make the site available from `parentproject.com/docs-site-name`, we need to create the path aliasing/redirect behavior we want (e.g., `/` redirects to `/docs-site-name`), in the consuming site's `gatsby-config.js` file. We set a `--prefix-paths` flag in the build script in the `/docs` directory.

   For the purposes of this demonstration, we're setting the value of our prefix path to be `/vercelredirects`, and instructing Gatsby to use that for the `/docs` directory in its `gatsby-config.js` file:

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

2. _Update package.json_

In `/docs` directory, update `package.json` with a build script that uses the `--prefix-paths` flag:

```
// package.json

"scripts":  {
  "build": "gatsby build --prefix-paths"
}

```

3. _Update vercel.json_
   The `--prefix-paths` flag tells Gatsby to prefix paths used in the `Link` component and `navigate` helper with the `pathPrefix` value assigned in the `gatsby-config.js` file. But `--prefix-paths` don't change where built files get stored in the build directory. That creates a mismatch between links on the site and the actual paths to the files.

So we need to define a route in `vercel.json` that that proxies `/vercelredirects/*` to `/*` so that behind the scenes a path like `/vercelredirects/page-2` will find `/page-2.html` in the build directory.

```
// vercel.json
"redirects": [
    {
      "source": "/",
      "permanent": true,
      "destination": "/vercelredirects"
    }
  ],
  "rewrites": [{ "source": "/vercelredirects(/.*)?", "destination": "/docs$1" }]

```

We've tried using the `redirects` and `rewrites` properties in different combinations with different parameters, following the instructions at [https://vercel.com/docs/project-configuration#legacy/routes/upgrading](https://vercel.com/docs/project-configuration#legacy/routes/upgrading).

We can only see the redirect behavior we want if we house `vercel.json` in the `/docs` directory and use the deprecated `routes` API:

```
// this works, but only when vercel.json is housed in `/docs` and when using deprecated `routes` API:

{
  "version": 2,
  "public": true,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "public"
      }
    }
  ],
  "routes": [
    { "src": "/vercelredirects(/.*)?", "dest": "$1" },
    {
      "src": "/",
      "status": 301,
      "headers": { "Location": "/vercelredirects/" }
    }
  ]
}


```

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

Also wraps `Layout` and provides those to sites using the theme via an `MDXProvider`, in order to be able to use links in MDX in consuming sites.

#### `/docs`

Example site that ships with the theme package.

`gatsby-config.js` demonstrates that `gatsby-theme-root-prefix-route-repro` is installed.

Renders a single page, from `/content/index.mdx`.

When you run `yarn start` from local project root, this is the page that renders.
