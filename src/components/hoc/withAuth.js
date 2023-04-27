import { tokenFetcher } from "@/modules/fetcher";
import { RedirectToSignIn, SignedIn, SignedOut, useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { SWRConfig } from "swr";
import Loading from "../Loading";

const withAuth = (WrappedComponent) => {
	const Wrapper = (props) => {
		const { isLoaded, userId, sessionId, getToken } = useAuth();
		const [token, setToken] = useState(null);

		useEffect(() => {
			async function process() {
				const myToken = await getToken({ template: "codehooks" });
				setToken(myToken);
			}
			process();
		}, [getToken]);

		if (!isLoaded || !token) return <Loading isPage={true} />;

		return (
			<>
				<SignedIn>
					<SWRConfig
						value={{
							fetcher: (url) => tokenFetcher([url, token]),
						}}
					>
						<WrappedComponent token={token} {...props} />
					</SWRConfig>
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
