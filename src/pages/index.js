import * as React from "react";
import PageDetails from "@/components/PageDetails";

function Home() {
	return (
		<>
			<PageDetails
				title="Clothing Tracker Homepage"
				description="This is the homepage for our clothing tracker app."
			/>
			<section className="section">
				<div className="container">
					<h1 className="title">Clothing Tracker</h1>
					<h2 className="subtitle">
						A simple app to track your clothing.
					</h2>
				</div>
			</section>
		</>
	);
}

export default Home;
