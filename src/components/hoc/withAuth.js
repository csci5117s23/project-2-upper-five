import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";

const withAuth = (WrappedComponent) => {
	const Wrapper = (props) => {
		return (
			<>
				<SignedIn>
					<WrappedComponent {...props} />
				</SignedIn>
				<SignedOut>
					<p>Redirecting you to the sign in page...</p>
					<RedirectToSignIn />
				</SignedOut>
			</>
		);
	};

	return Wrapper;
};

export default withAuth;
