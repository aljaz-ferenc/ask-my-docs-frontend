import { Client, Storage } from "appwrite";

const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const APPWRITE_BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID;

if (!APPWRITE_ENDPOINT || !APPWRITE_PROJECT_ID || !APPWRITE_BUCKET_ID)
  throw new Error("APPWRITE credentials missing in .env");

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT as string)
  .setProject(APPWRITE_PROJECT_ID as string);

export const storage = new Storage(client);
