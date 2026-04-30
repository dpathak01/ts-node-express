ts-node-express
# Typescript node express application using Docker and CI/CD
# Reference: https://blog.logrocket.com/express-typescript-node/
1. Initialize the project
    mkdir ts-node-express && cd ts-node-express
    npm init -y

    Then install dependencies:

    npm install express dotenv npm install -D typescript ts-node @types/node @types/express nodemon eslint prettier

2. Configure TypeScript
    npx tsc --init


ts-node-express/
├── src/
│   ├── config/
│   │   └── config.ts        // Load and type environment variables
│   ├── controllers/
│   │   └── itemController.ts  // CRUD logic for "items"
│   ├── middlewares/
│   │   └── errorHandler.ts    // Global typed error handling middleware
│   ├── models/
│   │   └── item.ts          // Define item type and in-memory storage
│   ├── routes/
│   │   └── itemRoutes.ts    // Express routes for items
│   ├── app.ts               // Express app configuration (middlewares, routes)
│   └── server.ts            // Start the server
├── .env                     // Environment variables
├── package.json             // Project scripts, dependencies, etc.
├── tsconfig.json            // TypeScript configuration
├── .eslintrc.js             // ESLint configuration
└── .prettierrc              // Prettier configuration

3. Environment configuration (typed environment variables)
    File: src/config/config.ts


    .env:
        PORT=3000
        NODE_ENV=development

4. Setting up testing with Jest
    npm install --save-dev jest ts-jest @types/jest
