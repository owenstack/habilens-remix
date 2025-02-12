import { defineConfig } from "drizzle-kit";
import fs from "node:fs";
import path from "node:path";

function getLocalD1DB() {
	try {
		const basePath = path.resolve(".wrangler");
		const dbFile = fs
			.readdirSync(basePath, { encoding: "utf-8", recursive: true })
			.find((f) => f.endsWith(".sqlite"));

		if (!dbFile) {
			throw new Error(`.sqlite file not found in ${basePath}`);
		}

		const url = path.resolve(basePath, dbFile);
		return url;
	} catch (err) {
		console.log(`Error  ${err}`);
	}
}

const config = (env: Env) =>
	defineConfig({
		dialect: "sqlite",
		schema: "./app/db/schema.ts",
		out: "./migrations",
		...(process.env.NODE_ENV === "production"
			? {
					driver: "d1-http",
					dbCredentials: {
						accountId: env.CLOUDFLARE_D1_ACCOUNT_ID,
						databaseId: env.DATABASE,
						token: env.CLOUDFLARE_D1_API_TOKEN,
					},
				}
			: {
					dbCredentials: {
						url: getLocalD1DB(),
					},
				}),
	});

export default config;
