import { imageFetcher } from "@/modules/fetcher";
import Image from "next/image";
import { useState } from "react";
import useSWRImmutable from "swr/immutable";

function TestComponent({ item, onEdit, onDelete }) {
	const [editMode, setEditMode] = useState(false);
	const [newItem, setNewItem] = useState(item);
	const { data, error } = useSWRImmutable(item.downloadUrl, imageFetcher);

	const handleEdit = () => {
		setEditMode(true);
	};

	const handleDelete = () => {
		onDelete(item);
	};

	const handleSave = () => {
		setEditMode(false);
		onEdit(newItem);
	};

	const handleCancel = () => {
		setEditMode(false);
		setNewItem(item);
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setNewItem({ ...newItem, [name]: value });
	};

	return (
		<div>
			{editMode ? (
				<div className="box">
					<input
						type="text"
						name="name"
						value={newItem.name}
						onChange={handleInputChange}
					/>
					<input
						type="text"
						name="type"
						value={newItem.type}
						onChange={handleInputChange}
					/>
					<input
						type="text"
						name="occasion"
						value={newItem.occasion}
						onChange={handleInputChange}
					/>
					<input
						type="text"
						name="imageId"
						value={newItem.imageId}
						onChange={handleInputChange}
					/>
					<button className="button" onClick={handleSave}>
						Save
					</button>
					<button className="button" onClick={handleCancel}>
						Cancel
					</button>
				</div>
			) : (
				<div className="box">
					<p>{item.name}</p>
					<p>{item.type}</p>
					<p>{item.occasion}</p>
					<p>{item.own.toString()}</p>
					<p>{item.imageId}</p>
					<p>{item.downloadUrl}</p>
					{data && <Image src={data} alt={item.name} width={100} height={100} />}
					<button className="button" onClick={handleEdit}>
						Edit
					</button>
					<button className="button" onClick={handleDelete}>
						Delete
					</button>
				</div>
			)}
		</div>
	);
}

export default TestComponent;
