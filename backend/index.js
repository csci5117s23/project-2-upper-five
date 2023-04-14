import { app } from "codehooks-js";
import { crudlify } from "codehooks-crudlify";
import jwtDecode from "jwt-decode";

/*
 * Kluver Code from: https://github.com/csci5117s23/Tech-Stack-2-Kluver-Demo/blob/main/backend/index.js
 */
const userAuth = async (req, res, next) => {
	try {
		const { authorization } = req.headers;
		if (authorization) {
			const token = authorization.replace("Bearer ", "");
			const token_parsed = jwtDecode(token);
			req.user_token = token_parsed;
		}
		next();
	} catch (error) {
		next(error);
	}
};
app.use(userAuth);
/*
 * End of Kluver Code
 */

/*
 * Schema for collections
 */

// Use Crudlify to create a REST API for any collection
crudlify(app);

// bind to serverless runtime
export default app.init();
