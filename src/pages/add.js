import AddForm from "@/components/AddForm";
import PageDetails from "@/components/PageDetails";
import withAuth from "@/components/hoc/withAuth";

function AddPage({ token }) {
	return (
		<>
			<PageDetails
				title="Add Clothing | Style Snips"
				description="This is the homepage for Style Snips."
			/>
			<div className="section pt-4">
				<h1 className="title is-1">Add Items to your Closet</h1>
				<AddForm token={token}></AddForm>
			</div>
		</>
	);
}

export default withAuth(AddPage);
