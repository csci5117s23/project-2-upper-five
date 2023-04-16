import PageDetails from "@/components/PageDetails";
import withAuth from "@/components/hoc/withAuth";

function SavedPage() {
	return (
		<>
			<PageDetails
				title="Clothing Tracker Saved Outfits"
				description="This is the homepage for our clothing tracker app."
			/>
			<div className="section pt-4">
				<h1 className="title is-1">Saved Page</h1>
			</div>
		</>
	);
}

export default withAuth(SavedPage);
