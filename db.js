import mongoose from "mongoose";

import { MONGODB_URI } from "./config.js";

mongoose
	.connect(MONGODB_URI)
	.then(() => {
		console.log("connnected to MongoDB");
	})
	.catch((error) => {
		console.error("error connection to MongoDB", error.message);
	});
