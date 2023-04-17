import Hex from "crypto-js/enc-hex";
import SHA1 from "crypto-js/sha1";
import WordArray from "crypto-js/lib-typedarrays";

/*
 * A function that given a blob file as the argument, will upload it to cloud storage
 * and will return the ID of the file that can then be used to download the file.
 */
export async function cloudUpload(file) {
	// 1. Fetch the upload URL
	const response = await fetch(`${NEXT_PUBLIC_API_URL}/get_upload_url`, {
		method: "GET",
		headers: {
			"x-api-key": NEXT_PUBLIC_API_KEY,
		},
	});
	const uploadUrl = await response.json();

	// 2. Create file details
	const fileName = file.name;
	const mimeType = file.type;
	const fileSize = file.size;

	const reader = new FileReader();

	reader.addEventListener("loadend", async (e) => {
		const checksum = SHA1(WordArray.create(reader.result)).toString(Hex);

		// 3. Use the upload URL to upload the file
		const uploadResponse = await fetch(data.uploadUrl, {
			method: "PUT",
			headers: {
				Authorization: data.uploadAuth,
				"Content-Type": mimeType,
				"Content-Length": fileSize,
				"X-Bz-File-Name": fileName,
				"X-Bz-Content-Sha1": checksum,
			},
			body: file,
		});
		return await uploadResponse.json();
	});

	reader.readAsArrayBuffer(file);
}
