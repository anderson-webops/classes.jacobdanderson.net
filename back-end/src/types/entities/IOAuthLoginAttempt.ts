import type { ExternalIdentityProvider } from "./IExternalIdentity.js";

export interface IOAuthLoginAttempt {
	browserBindingHash: string;
	codeVerifier: string;
	expiresAt: Date;
	nonce: string;
	provider: ExternalIdentityProvider;
	remember: boolean;
	returnTo: string;
	stateHash: string;
	createdAt: Date;
	updatedAt: Date;
}
