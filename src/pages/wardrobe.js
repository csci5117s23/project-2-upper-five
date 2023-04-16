import PageDetails from "@/components/PageDetails";
import withAuth from "@/components/hoc/withAuth";

function WardrobePage() {
	return (
		<>
			<PageDetails
				title="Clothing Tracker Wardrobe"
				description="This is the homepage for our clothing tracker app."
			/>
			<div className="section pt-4">
				<h1 className="title is-1">Wardrobe Page</h1>
			</div>
		</>
	);
}

export default withAuth(WardrobePage);
