import { Datastore, app } from "codehooks-js";
import { crudlify } from "codehooks-crudlify";
import jwtDecode from "jwt-decode";
import { boolean, object, string, boolean, array } from "yup";

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

const itemSchema = object({
	userId: string().required(),
	name: string().required().max(100),
	imageId: string().required(),
	type: string().required(),
	occasion: string().required(),
	own: boolean().required(),
});

const outfitSchema = object({
	userId: string().required(),
	name: string().required().max(100),
	items: array().of(string()).required(),
	typeOrder: array().of(string()).required(),
});

/*
 * Middleware
 */
function getPostHelper(req, res) {
	if (req.method === "POST") {
		console.log("POST request: " + JSON.stringify(req.body));
		req.body.userId = req.user_token.sub;
	} else if (req.method === "GET") {
		req.query.userId = req.user_token.sub;
	}
}

app.use("/items", (req, res, next) => {
	getPostHelper(req, res);
	next();
});

app.use("/items:id", async (req, res, next) => {
	const id = req.params.ID;
	const userId = req.user_token.sub;

	const conn = await Datastore.open();
	try {
		const doc = await conn.getOne("items", id);
		if (doc.userId != userId) {
			res.status(403).end();
			return;
		}
	} catch (e) {
		res.status(404).end();
		return;
	}

	next();
});

app.use("/outfits:id", async (req, res, next) => {
	const id = req.params.ID;
	const userId = req.user_token.sub;

	const conn = await Datastore.open();
	try {
		const doc = await conn.getOne("outfits", id);
		if (doc.userId != userId) {
			res.status(403).end();
			return;
		}
	} catch (e) {
		res.status(404).end();
		return;
	}

	next();
});

app.use("/outfits", (req, res, next) => {
	getPostHelper(req, res);
	next();
});

// Use Crudlify to create a REST API for any collection
crudlify(app, { items: itemSchema, outfits: outfitSchema });

// bind to serverless runtime
export default app.init();
