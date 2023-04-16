import { SignedIn, UserButton } from "@clerk/nextjs";

function Header() {
	return (
		<header className="p-4">
			<div className="is-flex is-flex-direction-row-reverse">
				<SignedIn>
					<UserButton />
				</SignedIn>
			</div>
		</header>
	);
}

export default Header;
