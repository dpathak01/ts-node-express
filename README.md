# ts-node-express

Typescript Node.js Express application with MongoDB CRUD support.


## Project Setup

```bash
mkdir ts-node-express
cd ts-node-express
npm init -y
```

Install dependencies:

```bash
npm install express dotenv mongoose @aws-sdk/client-secrets-manager
npm install -D typescript ts-node @types/node @types/express nodemon eslint prettier jest ts-jest @types/jest
```

Configure TypeScript:

```bash
npx tsc --init
```

## Project Structure

```text
ts-node-express/
├── src/
│   ├── config/
│   │   ├── config.ts        // Reads environment configuration
│   │   ├── database.ts      // Connects to MongoDB
│   │   └── secrets.ts       // Loads production secrets from AWS Secrets Manager
│   ├── controllers/
│   │   └── itemController.ts // CRUD logic for items
│   ├── middlewares/
│   │   └── errorHandler.ts  // Global error handler middleware
│   ├── models/
│   │   └── item.ts          // Mongoose item schema/model
│   ├── routes/
│   │   └── itemRoutes.ts    // Express routes for items
│   ├── app.ts               // Express app configuration
│   └── server.ts            // Loads config/secrets, connects DB, starts server
├── .env                     // Local-only environment variables
├── package.json
├── tsconfig.json
└── jest.config.js
```

## Environment Configuration

The app decides how to load secrets based on `NODE_ENV`.

Local development:

- `NODE_ENV` should be `development` or unset.
- The app loads credentials from local `.env` using `dotenv`.

Production:

- `NODE_ENV` must be `production`.
- The app does not load `.env`.
- The app reads `AWS_SECRET_NAME` and `AWS_REGION` from the server environment.
- The app fetches `MONGO_URL` from AWS Secrets Manager before connecting to MongoDB.

## Local Development

Create `.env` locally:

```env
PORT=3000
NODE_ENV=development
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/dbname
```

Run the app:

```bash
npm run dev
```

## Production With AWS Secrets Manager

Create a secret in AWS Secrets Manager. Example secret name:

```text
prod/ts-node-express
```

Secret value:

```json
{
  "MONGO_URL": "mongodb+srv://username:password@cluster.mongodb.net/dbname"
}
```

On EC2, set these environment variables through PM2, systemd, or your deployment process:

```env
NODE_ENV=production
PORT=3000
AWS_REGION=ap-south-1
AWS_SECRET_NAME=prod/ts-node-express
```

Attach an IAM role to the EC2 instance with permission to read the secret:

```json
{
  "Effect": "Allow",
  "Action": "secretsmanager:GetSecretValue",
  "Resource": "your-secret-arn"
}
```

If the secret uses a custom KMS key, also allow `kms:Decrypt`.

Build and start:

```bash
npm run build
npm start
```

## PM2 Example

```bash
pm2 start dist/server.js --name ts-node-express \
  --env NODE_ENV=production \
  --env PORT=3000 \
  --env AWS_REGION=ap-south-1 \
  --env AWS_SECRET_NAME=prod/ts-node-express
```

## API Endpoints

```text
GET    /api/items
GET    /api/items/:id
POST   /api/items
PUT    /api/items/:id
DELETE /api/items/:id
```

Create item request:

```json
{
  "name": "Laptop"
}
```

## Testing

Controller tests are implemented in `tests/itemController.test.ts`.

The suite mocks the Mongoose item model and covers:

- Create item success and error forwarding
- Get all items, including empty results and error forwarding
- Get item by id success, invalid id, not found, and error forwarding
- Update item success, invalid id, not found, and error forwarding
- Delete item success, invalid id, not found, and error forwarding

```bash
npm test
```

Run tests serially:

```bash
npm test -- --runInBand
```
