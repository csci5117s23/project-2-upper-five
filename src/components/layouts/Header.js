import { SignedIn, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

function Header() {
	const router = useRouter();
	const [rootPath, setRootPath] = useState("");

	useEffect(() => {
		async function process() {
			const path = router.pathname.substring(1);
			console.log(path);
			const pathArray = path.split("/");
			if (pathArray.length >= 2) {
				console.log(pathArray);
				const rootPath = pathArray[0];
				setRootPath("/" + rootPath);
			} else {
				setRootPath("");
			}
		}
		process();
	}, [router]);

	return (
		<header className="p-4">
			<div className="is-flex is-flex-direction-row is-justify-content-space-between">
				<div className="is-flex is-flex-direction-row">
					{rootPath.length > 0 && (
						<Link href={rootPath} className="button mr-2">
							<span className="icon">
								<FontAwesomeIcon icon={faArrowLeft} />
							</span>
							<span>Back</span>
						</Link>
					)}
					<p>Logo</p>
				</div>
				<div>
					<SignedIn>
						<UserButton />
					</SignedIn>
				</div>
			</div>
		</header>
	);
}

export default Header;
