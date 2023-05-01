import PageDetails from "./PageDetails";

import * as styles from "./Loading.module.scss";

function Loading({ isPage = false, hasError = false }) {
	if (isPage) {
		if (hasError) {
			return (
				<>
					<PageDetails title="Error" description="Error page" />
					<div>Error loading page</div>
				</>
			);
		}

		return (
			<>
				<PageDetails title="Loading..." description="Loading page" />
				<div>Page Loading...</div>
				<div className={styles.loadingWrapper}>
					<div className={styles.loading}></div>
				</div>
			</>
		);
	}

	if (hasError) {
		return <div>Error loading, please reload the page to try again.</div>;
	}

	return (
		<div className={styles.loadingComp}>
			<span>Loading...</span>
			<div className={styles.loadingWrapper}>
				<div className={styles.loading}></div>
			</div>
		</div>
	);
}

export default Loading;
