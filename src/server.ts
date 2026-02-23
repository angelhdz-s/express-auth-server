import { PORT } from "./config/constants.js";
import { connectDB } from "./config/db.js";
import { app } from "./index.js";

connectDB()
	.then(() => {
		app.listen(PORT, () => {
			console.log(`Example app listening on port ${PORT}`);
		});
	})
	.catch((err) => {
		console.error("Error connecting to DB", err);
	});
