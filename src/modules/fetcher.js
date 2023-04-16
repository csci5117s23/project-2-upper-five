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

export { fetcher, tokenFetcher };
