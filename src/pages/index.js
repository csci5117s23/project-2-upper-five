import PageDetails from "@/components/PageDetails";
import { SignIn, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as styles from "./index.module.scss";

/*
 * This is the homepage of our clothing tracker. It doesn't have anything to do with the actual app and is simply a
 * a check page to see if the user is logged in or not. If they are logged in, they are redirected to the /wardrobe,
 * other wise they will be presented with login UI.
 */
function Home() {
	const router = useRouter();
	const { isLoaded, userId, sessionId, getToken } = useAuth();

	// If user is logged in, redirect to /wardrobe
	useEffect(() => {
		if (userId) {
			router.push("/wardrobe");
		}
	}, [userId, router]);

	return (
		<>
			<PageDetails
				title="Clothing Tracker Login"
				description="Please log in to use our clothing tracker"
			/>
			<section className="section">
				<div className="columns">
					<div className="column"></div>
					<div className="column has-text-centered">
						<h1 className="title">
							Welcome To
							<br />
							Clothing Tracker
						</h1>
						<div className={styles.signInContainer}>
							{userId ? null : <SignIn></SignIn>}
						</div>
					</div>
					<div className="column"></div>
				</div>
			</section>
		</>
	);
}

export default Home;
