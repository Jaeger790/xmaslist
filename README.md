# Christmas List

Small Express and PostgreSQL app for saving gift ideas by person.

## Layout

- `server.js`: create, read, update and delete API for gift-list items.
- `static/index.html`: browser client, deployed separately in the Render configuration.
- `render.yaml`: Render services and database configuration.

## Local setup

Install the Node.js dependencies with `npm install`. Set `DATABASE_URL` to a PostgreSQL connection string and run `npm start`. The server creates the `items` table at startup. The existing connection code requests TLS, so local PostgreSQL must support that configuration. Update the API URL in `static/index.html` for your own backend before using the client locally.

## Configuration

The Render blueprint now reads `DATABASE_URL` from the managed database rather than committing a connection string. The database password previously committed in the blueprint must be rotated in Render. It remains in earlier Git commits.

## Review findings

The current API has no authentication and allows requests from any origin. Input validation, rejected async request handling, certificate verification and waiting for schema setup before listening need work before broader use. Those runtime changes are separate from this repository-organization pass. Deployment and database access were not tested.
## Related projects

See the [project index](https://github.com/Jaeger790#projects) for the rest of my work.
