import app from "./app.js";
import { logger } from "./config/logger.js";

app.listen(3000, () => {
	logger.info(`Server is running on port 3000`);
});
