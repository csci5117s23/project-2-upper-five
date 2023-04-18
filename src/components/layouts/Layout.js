import { useAuth } from "@clerk/nextjs";
import FooterNav from "./FooterNav";
import { useEffect, useState } from "react";
import { SWRConfig } from "swr";
import { tokenFetcher } from "@/modules/fetcher";
import Header from "./Header";

const createFetcher = (token) => (url) => tokenFetcher([url, token]);

function Layout({ children }) {
	const { isLoaded, userId, sessionId, getToken } = useAuth();
	const [token, setToken] = useState(null);
	const [fetcherWithToken, setFetcherWithToken] = useState(null);

	useEffect(() => {
		async function process() {
			const myToken = await getToken({ template: "codehooks" });
			setToken(myToken);
			setFetcherWithToken(createFetcher(myToken));
		}
		process();
	}, [getToken]);

	if (!isLoaded) return <div>Loading...</div>;

	return (
		<>
			<div className="pageContainer">
				<div className="contentWrapper">
					<SWRConfig
						value={{
							fetcher: fetcherWithToken,
							fallback: <div>Loading...</div>,
						}}
					>
						<Header />
						<main>{children}</main>
					</SWRConfig>
				</div>
				{token ? <FooterNav /> : null}
			</div>
		</>
	);
}

export default Layout;
