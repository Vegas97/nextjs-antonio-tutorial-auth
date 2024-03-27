This is a [Next.js](https://nextjs.org/) project bootstrapped
with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and
load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions
are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use
the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)
from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

---

# Personal Notes

## Installation of the project ui

https://ui.shadcn.com/docs/installation/next

```
npx shadcn-ui@latest init
```

## Installation of a normal button component with shadcn-ui

```
npx shadcn-ui@latest add button
```

## install prisma

in dev dependencies

```
 npm i -D prisma
```

also this one

```
 npm i @prisma/client
```

## setup prisma

initiate prisma, this will create a prisma folder with a schema.prisma file

```
 npx prisma init
```

go to neon database and create a new database.
you'll get the DATABASE_URL for .env file and the code insert it in the schema.prisma file

then we can generate the client
this will create a client folder in the prisma folder

```
 npx prisma generate
```

```
vegas@M1-MAX-Diego nextjs-antonio-tutorial-auth % npx prisma generate
Prisma schema loaded from prisma/schema.prisma

✔ Generated Prisma Client (v5.11.0) to ./node_modules/@prisma/client in 43ms

Start using Prisma Client in Node.js (See: https://pris.ly/d/client)


import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


or start using Prisma Client at the edge (See: https://pris.ly/d/accelerate)


import { PrismaClient } from '@prisma/client/edge'
const prisma = new PrismaClient()


See other ways of importing Prisma Client: http://pris.ly/d/importing-client

┌─────────────────────────────────────────────────────────────┐
│  Deploying your app to serverless or edge functions?        │
│  Try Prisma Accelerate for connection pooling and caching.  │
│  https://pris.ly/cli/accelerate                             │
└─────────────────────────────────────────────────────────────┘
```

basically when you will use it like this,
in the edit as soon you type the dot (.) after the db
there will be actually a suggestion to user because is an object generated in the node_modules.

```
import { db } from '@/lib/db'
const user = await db.user.findMany()
```

add a new script in the package.json file

```
"push:dev": "dotenv -e .env.local -- npx prisma db push",
```

at run it like this

```
npm run push:dev
```

we did this because the DATABASE_URL is in the .env.local file
and contains sensitive information, and wont be pushed to the git repository

## configure Auth.js Prisma Adapter

```
npm i @auth/prisma-adapter
```
