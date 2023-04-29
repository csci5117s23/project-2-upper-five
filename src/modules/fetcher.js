const apiFetcher = (url) =>
	fetch(url, {
		method: "GET",
		headers: {
			"x-apikey": process.env.NEXT_PUBLIC_API_KEY,
		},
	}).then((r) => r.json());

// token fetcher will take in url and token 
// Return json response after fetching
const tokenFetcher = ([url, token]) => {
	// console.log("Token Fetcher: " + url + " with: " + token);
	return fetch(url, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})
		.then((r) => r.json())
		.catch((e) => {
			console.log("Fetcher No data returned: " + e);
		});
};

const imageFetcher = (url) => {
	return fetch(url, {
		method: "GET",
	})
		.then((r) => {
			//console.log("Response type: " + r.type);
			return r.blob();
		})
		.then((blob) => {
			//console.log("Blob: " + blob.name);
			return URL.createObjectURL(blob);
		});
};

const postFetcher = ([url, token, body]) => {
	return fetch(url, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	})
		.then((r) => r.json())
		.catch((e) => {
			console.log("Error with POST fetcher: " + e);
		});
};

const putFetcher = ([url, token, body]) => {
	return fetch(url, {
		method: "PUT",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	})
		.then((r) => r.json())
		.catch((e) => {
			console.log("Error with PUT fetcher: " + e);
		});
};

const deleteFetcher = ([url, token]) => {
	return fetch(url, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})
		.then((r) => r.json())
		.catch((e) => {
			console.log("Error with DELETE fetcher: " + e);
		});
};

export {
	apiFetcher,
	tokenFetcher,
	imageFetcher,
	postFetcher,
	putFetcher,
	deleteFetcher,
};
