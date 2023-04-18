import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr";

function WardrobeItemPage() {
	const router = useRouter();
	const { id } = router.query;
	const [editMode, setEditMode] = useState(false);

	const { data, mutate, error } = useSWR(
		`${process.env.NEXT_PUBLIC_API_URL}/items/${id}`
	);

	if (error) return <div>Failed to load</div>;

	return <div>Wardrobe Item: {id}</div>;
}

export default WardrobeItemPage;
