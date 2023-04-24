import Layout from "@/components/layouts/Layout";
import "@/styles/globals.scss";
import { ClerkProvider } from "@clerk/nextjs";

// Font Awesome
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;
import { library } from "@fortawesome/fontawesome-svg-core";
import {
	faHome,
	faPlus,
	faShirt,
	faStar,
} from "@fortawesome/free-solid-svg-icons";

library.add(faHome, faPlus, faShirt, faStar);

export default function App({ Component, pageProps }) {
	return (
		<ClerkProvider {...pageProps}>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</ClerkProvider>
	);
}
