import mongoose from "mongoose";

export async function connectMongo(uri: string): Promise<void> {
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
}

export function buildMongoUri(env: {
  MONGO_HOST: string;
  MONGO_USER: string;
  MONGO_PASSWORD: string;
}): string {
  const user = encodeURIComponent(env.MONGO_USER);
  const pass = encodeURIComponent(env.MONGO_PASSWORD);

  return `mongodb+srv://${user}:${pass}@${env.MONGO_HOST}/?retryWrites=true&w=majority&appName=java-cluster`;
}