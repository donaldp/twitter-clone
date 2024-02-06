# Twitter Clone

This is a simple Twitter clone built with FormidableJs and React.

## Requirements

- Node.js
- NPM
- Mailtrap account

## Getting Started

To get started, clone the repository:

```bash
git clone https://github.com/donaldp/twitter-clone.git
cd twitter-clone
```

Then install the dependencies:

```bash
npm install
```

## Configuration

Create a database file:

```bash
touch database/db.sqlite
```

Create a `.env` file in the root of the project. You can clone the `.env.example` file to get started:

```bash
cp .env.example .env
```

Then add mailtrap credentials to the `.env` file:

```bash
MAIL_USERNAME=
MAIL_PASSWORD=
```

> You can get the mailtrap credentials from your mailtrap account. If you don't have an account, you can create one [https://mailtrap.io/](https://mailtrap.io/).

Once you have added the mailtrap credentials, you can generate an application key:

```bash
node craftsman key:generate
```

Then run application migrations:

```bash
node craftsman migrate:latest
```

Build the application:

```bash
npm run build
npm run mix:prod
```

Finally, start the server:

```bash
npm start
```

## Running tests

To run the tests, run:

```bash
npm test
```

## FAQ

### Login/Tweeting not working?

If you are having issues with logging in or tweeting, you might need to update the `APP_URL` and `CLIENT_URL` in the `.env` file to match your local environment. For example, if you are running the application on `http://localhost:3000`, you should update the `APP_URL` and `CLIENT_URL` to `http://localhost:3000`.

This typically happens when you are running the application on a different port or domain.

> Note: if you make changes to the `.env` file, you will need to rebuild and re-cache the application:

```bash
node craftsman config:cache
npm run build
```

### How do I access the application?

Once the server is running, you can access the application on `http://localhost:3000` in your browser.

But if you're interested in the api, you can access it on `http://localhost:3000/api`.

#### API Endpoints

All of these endpoints require the following headers:

```http
Accept: application/json
Content-Type: application/json
```

`POST /api/login` - Generate a bearer token

`GET  /api/tweets` - Get all tweets (feed)

`PUT  /api/tweets` - Create a new tweet - requires a bearer token

Body
```json
{
  "tweet": "Hello, world!"
}
```

`GET  /api/tweets/:snowflake_id` - Get a single tweet

`GET  /api/tweets/@:username` - Get users timeline

You can also run:

```bash
node craftsman route:list
```

## Points of Interest

- The application is built with FormidableJs, a modern web framework for Node.js.
- The frontend is built with React and TailwindCSS.
- The application uses SQLite as the database.

### Files to look at

- `app/Http/Controllers/*` - Controllers
- `app/Repositories/*` - Database Repositories
- `app/Services/Authentication` - Authentication Service
- `resources/js/*` - React components
- `database/migrations/*` - Migrations
- `routes/*` - Registered routes
