import { SignedIn } from "@clerk/nextjs";
import FooterNav from "./FooterNav";
import Header from "./Header";

function Layout({ children }) {
	return (
		<>
			<div className="pageContainer">
				<div className="contentWrapper">
					<Header />
					<main>{children}</main>
				</div>
				<SignedIn>
					<FooterNav />
				</SignedIn>
			</div>
		</>
	);
}

export default Layout;
