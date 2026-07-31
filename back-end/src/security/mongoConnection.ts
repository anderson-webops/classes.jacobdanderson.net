export interface MongoConnectionEnvironment {
	MONGODB_URI?: string;
	VAULT_ADDR?: string;
	VAULT_ROLE_ID?: string;
	VAULT_SECRET_ID?: string;
}

export interface MongoConnectionSelection {
	source: "environment" | "vault";
	uri: string;
}

type ReadMongoSecret = () => Promise<{ uri: string }>;

function configured(value: string | undefined) {
	return Boolean(value?.trim());
}

/**
 * Select exactly one Mongo credential source. Once a Vault address or AppRole
 * setting is supplied, Vault is an explicit operator choice and failures must
 * not silently downgrade to a separate environment credential.
 */
export async function selectMongoConnection(
	environment: MongoConnectionEnvironment,
	readMongoSecret: ReadMongoSecret
): Promise<MongoConnectionSelection> {
	const vaultRequested
		= configured(environment.VAULT_ADDR)
			|| configured(environment.VAULT_ROLE_ID)
			|| configured(environment.VAULT_SECRET_ID);

	if (vaultRequested) {
		if (
			!configured(environment.VAULT_ROLE_ID)
			|| !configured(environment.VAULT_SECRET_ID)
		) {
			throw new Error(
				"Vault was requested but its AppRole credentials are incomplete."
			);
		}

		const secret = await readMongoSecret();
		const uri = secret.uri?.trim();
		if (!uri) {
			throw new Error("Vault MongoDB secret did not include a URI.");
		}
		return { source: "vault", uri };
	}

	const uri = environment.MONGODB_URI?.trim();
	if (!uri) {
		throw new Error("MONGODB_URI is required when Vault is not configured.");
	}
	return { source: "environment", uri };
}
