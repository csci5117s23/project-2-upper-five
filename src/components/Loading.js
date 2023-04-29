import PageDetails from "./PageDetails";

import * as styles from "./Loading.module.scss";

function Loading({ isPage = false }) {
	if (isPage) {
		return (
			<>
				<PageDetails title="Loading..." description="Loading page" />
				<div>Page Loading...</div>
				<div className={styles.loading}></div>
			</>
		);
	}

	return (
		<div>
			Loading... <span className={styles.loading}></span>
		</div>
	);
}

export default Loading;
