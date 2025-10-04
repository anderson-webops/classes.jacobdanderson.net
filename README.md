# Classes monorepo

This repository hosts both the front-end (Vite + Vue 3) and back-end (Express)
applications that power classes.jacobdanderson.net. The workspace is managed
with npm workspaces; most commands can be run from the repository root by
passing the `-w` flag to select the project.

## Installation

```bash
npm install
```

## Local development

Run the front-end SSG app in dev mode:

```bash
npm run -w front-end dev
```

Run the Express API locally (loads environment variables from `.env`):

```bash
npm run -w back-end server
```

## API base URL configuration

The front-end uses Axios via `src/api.ts`. By default requests are made against
`/api`, which is proxied to the Express server in development. In production
deployments you will usually want to point to the deployed API host instead.

Set the following build-time environment variable when generating the static
site to override the base URL:

```
VITE_API_BASE_URL=https://your-api-host.example.com
```

With this configuration the admin mail tool and other authenticated requests
will target the correct server instead of the static host.

## Debugging on the server

The Express server logs to standard output. Two helpful log sources are:

* `Connected to MongoDB` messages emitted during startup.
* 404 and unexpected error logs written by the handlers at the bottom of
  `back-end/src/server.ts`. Every unmatched request is logged as
  `404 Not Found: <METHOD> <path>`, and uncaught errors include the stack trace.

When running the API under a process manager (for example `pm2`, `systemd`, or
Docker) inspect that service's stdout/stderr logs to diagnose issues such as the
admin mail endpoint returning `404` in production.
