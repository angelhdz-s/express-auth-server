import { PORT } from "./config/constants.js";
import { app } from "./index.js";

app.listen(PORT, () => {
	console.log(`Example app listening on port ${PORT}`);
});
