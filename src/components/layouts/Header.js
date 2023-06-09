import { SignedIn, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Image from "next/image";

function Header() {
	const router = useRouter();
	const [rootPath, setRootPath] = useState("");

	useEffect(() => {
		async function process() {
			const path = router.pathname.substring(1);
			const pathArray = path.split("/");
			if (pathArray.length >= 2) {
				const rootPath = pathArray[0];

				const back = router.query.back;
				const type = router.query.type;

				if (back) {
					setRootPath("/" + type + "/" + back);
				} else {
					setRootPath("/" + rootPath);
				}
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
					<Link href="/wardrobe">
						<Image
							src="/style-snips.png"
							width={100}
							height={75}
							alt="Style Snips Logo"
						/>
					</Link>
				</div>
				<div>
					<SignedIn>
						<UserButton showName={true} />
					</SignedIn>
				</div>
			</div>
		</header>
	);
}

export default Header;
