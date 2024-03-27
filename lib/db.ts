// Import the PrismaClient constructor from the "@prisma/client" package
import { PrismaClient } from "@prisma/client";
import { undefined } from "zod";

// Declare a global variable "prisma" of type PrismaClient in the global namespace
// This is to ensure that we can use the same instance of PrismaClient across our application
declare global {
  var prisma: PrismaClient | undefined;
}

// If "prisma" is already defined in the global namespace, use that instance
// Otherwise, create a new instance of PrismaClient
// This is to prevent creating new instances of PrismaClient on every request in a serverless environment
// because in dev every time there is a hot reload, the prisma instance is recreated and not deleted.
// to prevent this we save it in the globalThis object, that is not deleted on hot reloads, so we can reuse the prisma instance.
export const db = globalThis.prisma || new PrismaClient();

// If the application is not running in production mode, assign the PrismaClient instance to the global "prisma" variable
// This is to ensure that the PrismaClient instance is reused during development, improving performance
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}
