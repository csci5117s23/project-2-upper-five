const fetcher = (url) => fetch(url).then((r) => r.json());

const tokenFetcher = ([url, token]) => {
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

export { fetcher, tokenFetcher, imageFetcher };
