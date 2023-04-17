import AddForm from "@/components/AddForm";
import PageDetails from "@/components/PageDetails";
import withAuth from "@/components/hoc/withAuth";

function AddPage() {
	return (
		<>
			<PageDetails
				title="Clothing Tracker Add Clothing"
				description="This is the homepage for our clothing tracker app."
			/>
			<div className="section pt-4">
				<h1 className="title is-1">Add Page</h1>
				<AddForm></AddForm>
			</div>
		</>
	);
}

export default withAuth(AddPage);
