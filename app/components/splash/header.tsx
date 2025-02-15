"use client";

import { Logo } from "../logo";
import { Link } from "@remix-run/react";
import { buttonVariants } from "../ui/button";
import { User2, ArrowUpRight } from "lucide-react";
import { cn } from "~/lib/utils";
import { ModeToggle } from "../mode-toggle";

export function Navbar({ className }: { className?: string }) {
	return (
		<header
			className={cn(
				"top-0 flex items-center justify-between gap-4 border-primary border-b px-4 py-2 backdrop-blur-sm",
				className,
			)}
		>
			<Logo />
			{/* TODO: to be uncommented as we progress */}
			{/* <nav className="flex items-center gap-2">
				<Link to={"/"} className={buttonVariants({ variant: "link" })}>
					Properties
				</Link>
				<Link to={"/"} className={buttonVariants({ variant: "link" })}>
					Blog
				</Link>
				<Link to={"/"} className={buttonVariants({ variant: "link" })}>
					Landlords
				</Link>
			</nav>
			<div className="hidden items-center gap-2 md:flex">
				<Link
					to={"/"}
					className={cn(buttonVariants({ variant: "ghost" }), "text-primary")}
				>
					<User2 className="mr-1" />
					Log in
				</Link>
				<Link to={"/"} className={buttonVariants()}>
					Submit Listing
					<ArrowUpRight className="ml-1" />
				</Link>
			</div> */}
			<ModeToggle />
		</header>
	);
}
