import { Outlet } from "@remix-run/react";
import { Navbar } from "~/components/splash/header";

export default function MktLayout() {
	return (
		<>
			<div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] after:absolute after:inset-0 after:bg-gradient-to-t after:from-background/80 after:to-background/20" />
			<Navbar />
			<Outlet />
		</>
	);
}
