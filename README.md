# Christmas List

Small Express and PostgreSQL app for saving gift ideas by person.

## Layout

- `server.js`: create, read, update and delete API for gift-list items.
- `static/index.html`: browser client, deployed separately in the Render configuration.
- `render.yaml`: Render services and database configuration.

## Local setup

Install the Node.js dependencies with `npm install`. Set `DATABASE_URL` to a PostgreSQL connection string and run `npm start`. The server creates the `items` table at startup. The existing connection code requests TLS, so local PostgreSQL must support that configuration. Update the API URL in `static/index.html` for your own backend before using the client locally.

## Configuration

The Render blueprint leaves `DATABASE_URL` unconfigured (`sync: false`). Supply it privately in Render. `credentials.example.json` contains null placeholders and is not loaded automatically.

## Review findings

The current API has no authentication and allows requests from any origin. Input validation, rejected async request handling, certificate verification and waiting for schema setup before listening need work before broader use. Those runtime changes are separate from this repository-organization pass. Deployment and database access were not tested.
## Related projects

See the [project index](https://github.com/Jaeger790#projects) for the rest of my work.
