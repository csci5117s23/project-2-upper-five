import { Datastore, app } from "codehooks-js";
import { crudlify } from "codehooks-crudlify";
import jwtDecode from "jwt-decode";
import { boolean, object, string, array, date } from "yup";
import fetch from "node-fetch";

// const B2_KEY_ID = process.env.B2_KEY_ID;
// const B2_APPLICATION_KEY = process.env.B2_APPLICATION_KEY;
// const B2_BUCKET_ID = process.env.B2_BUCKET_ID;

const B2_KEY_ID = "66c446d439bf";
const B2_APPLICATION_KEY = "005efd59b013d37a0a35a1b2e27c98eea8acacaa1e";
const B2_BUCKET_ID = "56366cf4b4f64d7483790b1f";

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
		console.log(error);
		res.status(400);
		res.json(error).end();
	}
};
app.use(userAuth);
/*
 * End of Kluver Code
 */

/*
 * Cloud Storage
 */
async function getAuthDetails() {
	console.log("Getting Backblaze auth details");
	console.log("From bucket: " + B2_BUCKET_ID);

	// 1. Encoded our account ID and key, as per the Backblaze docs
	let encoded = Buffer.from(B2_KEY_ID + ":" + B2_APPLICATION_KEY).toString(
		"base64"
	);

	// 2. Make the fetch request to get our system level auth details
	const response = await fetch(
		"https://api.backblazeb2.com/b2api/v2/b2_authorize_account",
		{
			method: "GET",
			headers: {
				Authorization: "Basic " + encoded,
			},
		}
	);
	const data = await response.json();
	console.log("Returning details");
	console.log("Url: " + data.apiUrl);
	console.log("Auth: " + data.authorizationToken);

	// 3. Return the apiUrl, authToken, and the downloadUrl to the user
	return {
		apiUrl: data.apiUrl,
		authToken: data.authorizationToken,
		downloadUrl: data.downloadUrl,
	};
}

app.get("/get_upload_url", async (req, res) => {
	// 1. Get the auth details
	let authDetails = await getAuthDetails();

	// 2. Make the fetch request to get the upload URL
	const response = await fetch(
		`${authDetails.apiUrl}/b2api/v2/b2_get_upload_url?bucketId=${B2_BUCKET_ID}`,
		{
			method: "GET",
			headers: {
				Authorization: authDetails.authToken,
			},
		}
	);
	const data = await response.json();
	// Optional, error checking
	if (!data.uploadUrl || !data.authorizationToken) {
		res.status(500).send("Failed to get upload URL");
		return;
	}

	res.json({
		uploadUrl: data.uploadUrl,
		uploadAuth: data.authorizationToken,
	});
});

app.get("/get_download_url", async (req, res) => {
	let authDetails = await getAuthDetails();

	res.json({
		downloadUrl: authDetails.downloadUrl,
		downloadAuth: authDetails.authToken,
	});
});

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
	downloadUrl: string(),
	dateAdded: date()
		.required()
		.default(() => new Date()),
});

const outfitSchema = object({
	userId: string().required(),
	name: string().required().max(100),
	items: array().of(string()).required(),
	typeOrder: array().of(string()).required(),
	dateAdded: date()
		.required()
		.default(() => new Date()),
});

/*
 * Middleware
 */
function getPostHelper(req, res) {
	if (req.method === "POST") {
		console.log("POST request: " + JSON.stringify(req.body));
		req.body._id = undefined; // don't allow the user to set the id
		req.body.userId = req.user_token.sub;
	} else if (req.method === "GET") {
		req.query.userId = req.user_token.sub;
	}
}

app.use("/items", async (req, res, next) => {
	console.log(
		"Trying to get all the items that belong to user: " + req.user_token.sub
	);
	getPostHelper(req, res);

	if (req.method === "POST") {
		const authDetails = await getAuthDetails();
		const downloadUrl = authDetails.downloadUrl;
		req.body.downloadUrl =
			downloadUrl +
			"/b2api/v1/b2_download_file_by_id?fileId=" +
			req.body.imageId;
	}

	next();
});

app.use("/items:id", async (req, res, next) => {
	const id = req.params.ID;
	const userId = req.user_token.sub;
	req.body._id = id; // don't allow the user to change the id
	req.body.userId = userId;

	if (req.method === "PUT") {
		const authDetails = await getAuthDetails();
		const downloadUrl = authDetails.downloadUrl;
		req.body.downloadUrl =
			downloadUrl +
			"/b2api/v1/b2_download_file_by_id?fileId=" +
			req.body.imageId;
	}

	const conn = await Datastore.open();
	try {
		const doc = await conn.getOne("items", id);
		if (doc.userId != userId) {
			res.status(403);
			res.json({ error: "Forbidden" }).end();
			return;
		}
	} catch (e) {
		res.status(404);
		res.json(error).end();
		return;
	}

	next();
});

app.use("/outfits:id", async (req, res, next) => {
	const id = req.params.ID;
	const userId = req.user_token.sub;
	req.body._id = id; // don't allow the user to change the id

	const conn = await Datastore.open();
	try {
		const doc = await conn.getOne("outfits", id);
		if (doc.userId != userId) {
			res.status(403);
			res.json({ error: "Forbidden" }).end();
			return;
		}
	} catch (e) {
		res.status(404);
		res.json(error).end();
		return;
	}

	next();
});

app.use("/outfits", async (req, res, next) => {
	getPostHelper(req, res);

	const item = req.query.contains;
	console.log("Item query: " + item);
	if (item) {
		const userId = req.user_token.sub;
		const conn = await Datastore.open();

		const options = {
			filter: { userId: userId, items: { $elemMatch: { $eq: item } } },
		};

		console.log("Options: " + JSON.stringify(options));
		conn.getMany("outfits", options).json(res);
		return;
	}

	next();
});

app.get("/get_items_from_outfit/:id", async (req, res) => {
	const id = req.params.id;
	const userId = req.user_token.sub;
	const conn = await Datastore.open();
	try {
		const doc = await conn.getOne("outfits", id);
		if (doc.userId != userId) {
			res.status(403);
			res.json({ error: "Forbidden" }).end();
			return;
		} else {
			const options = {
				filter: { userId: userId, _id: { $in: doc.items } },
			};
			conn.getMany("items", options).json(res);
			return;
		}
	} catch (e) {
		res.status(404);
		res.json(error).end();
		return;
	}
});

// Use Crudlify to create a REST API for any collection
crudlify(app, { items: itemSchema, outfits: outfitSchema });

// bind to serverless runtime
export default app.init();
