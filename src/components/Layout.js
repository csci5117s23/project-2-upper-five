import FooterNav from "./FooterNav";

function Layout({ children }) {
	return (
		<>
			<div className="pageContainer">
				<div className="contentWrapper">
					<main>{children}</main>
				</div>
				<FooterNav />
			</div>
		</>
	);
}

export default Layout;
