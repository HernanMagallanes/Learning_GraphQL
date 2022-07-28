import { config } from "dotenv";

config();

export const MONGODB_URI =
	process.env.MONGODB_URI || "mongodb://localhost/graphQL_db";

export const PORT = process.env.PORT || 5000;

export const JWT_SECRET = process.env.JWT_SECRET;
