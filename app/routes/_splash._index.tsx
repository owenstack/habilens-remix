import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { type FormEvent, useState } from "react";

export default function Index() {
	return (
		<main className="relative flex min-h-screen flex-col py-20 md:py-0 sm:py-20">
			<div className="flex-1">
				<div className="relative flex h-full max-w-full items-center justify-center overflow-hidden rounded-lg p-5 md:p-10 mt-5 sm:mt-20">
					<div className="flex flex-col items-center justify-center space-y-5 sm:space-y-10">
						<div className="w-full text-center px-4 sm:px-0">
							<h1 className="text-2xl sm:text-4xl lg:text-6xl font-semibold leading-tight text-primary">
								Join Our Wait list: Be One of the First to Discover What's
								Coming!
							</h1>
							<p className="text-lg mt-4 sm:text-xl text-secondary">
								This landing page is built specially to save your time. Find the
								product-market-fit before you launch.
							</p>
							<LoopsForm />
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}

const LoopsForm = () => {
	const formStates = ["INIT", "SUBMITTING", "ERROR", "SUCCESS"] as const;
	const [email, setEmail] = useState("");
	const [formState, setFormState] =
		useState<(typeof formStates)[number]>("INIT");
	const [error, setError] = useState("");
	const [fields, setFields] = useState({});

	const SignUpFormError = () => {
		return (
			<div className="flex items-center justify-center w-full">
				<p className="font-serif text-destructive">
					{error || "Oops! Something went wrong, please try again"}
				</p>
			</div>
		);
	};

	const isValidEmail = (email: string) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const resetForm = () => {
		setEmail("");
		setFormState("INIT");
		setError("");
	};

	const hasRecentSubmission = () => {
		const time = new Date();
		const timestamp = time.valueOf();
		const previousTimestamp = localStorage.getItem("loops");

		if (
			previousTimestamp &&
			Number(previousTimestamp) + 60 * 1000 > timestamp
		) {
			setFormState("ERROR");
			setError("Too many sign ups, please try again in a while");
			return true;
		}
		localStorage.setItem("loops", timestamp.toString());
		return false;
	};

	const submit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (formState !== "INIT") return;
		if (!isValidEmail(email)) {
			setFormState("ERROR");
			setError("Please enter a valid email");
			return;
		}
		if (hasRecentSubmission()) return;

		setFormState("SUBMITTING");

		const additionalFields = Object.entries(fields).reduce(
			(acc, [key, val]) => {
				if (val) {
					return `${acc}&${key}=${encodeURIComponent(val as string)}`;
				}
				return acc;
			},
			"",
		);

		try {
			const formBody = `userGroup=alpha_users&email=${encodeURIComponent(email)}&mailingLists=`;
			const response = await fetch(
				"https://app.loops.so/api/newsletter-form/cm6urwvv601nwp735m3u1y228",
				{
					method: "POST",
					body: formBody + additionalFields,
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
				},
			);

			// biome-ignore lint/suspicious/noExplicitAny: not sure of the type to be expected
			const data: any = await response.json();

			if (response.ok) {
				resetForm();
				setFormState("SUCCESS");
			} else {
				setFormState("ERROR");
				setError(data.message || response.statusText);
				localStorage.removeItem("loops");
			}
		} catch (error) {
			setFormState("ERROR");
			if (error instanceof Error) {
				if (error.message === "Failed to fetch") {
					setError("Too many sign ups, please try again later");
				} else {
					setError(error.message);
				}
			}
			localStorage.removeItem("loops");
		}
	};

	switch (formState) {
		case "SUCCESS":
			return (
				<div className="flex items-center justify-center w-full">
					<p className="font-serif text-xl">Thanks! We'll be in touch!</p>
				</div>
			);
		case "ERROR":
			return (
				<>
					<SignUpFormError />
					<Button variant="link" onClick={resetForm}>
						← Back
					</Button>
				</>
			);
		default:
			return (
				<>
					<form
						onSubmit={submit}
						className="mt-4 flex flex-col items-center justify-center gap-4 w-full mx-auto py-5 max-w-sm"
					>
						<Input
							type="email"
							name="email"
							placeholder="Enter your email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							aria-label="Email address"
						/>
						<Button
							type="submit"
							className="w-full"
							disabled={formState === "SUBMITTING"}
						>
							{formState === "SUBMITTING" ? "Submitting..." : "Submit"}
						</Button>
					</form>
				</>
			);
	}
};
