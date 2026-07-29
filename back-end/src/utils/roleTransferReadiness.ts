import mongoose from "mongoose";

export interface RoleTransferReadiness {
	ok: boolean;
	reason?: "database-not-connected" | "transactions-not-supported" | "topology-check-failed";
	topology?: "mongos" | "replica-set";
}

export async function getRoleTransferReadiness(): Promise<RoleTransferReadiness> {
	const database = mongoose.connection.db;
	if (mongoose.connection.readyState !== 1 || !database) {
		return { ok: false, reason: "database-not-connected" };
	}

	try {
		const hello = await database.admin().command({
			hello: 1,
			maxTimeMS: 2_000
		});
		if (hello.msg === "isdbgrid") {
			return { ok: true, topology: "mongos" };
		}
		if (typeof hello.setName === "string" && hello.setName) {
			return { ok: true, topology: "replica-set" };
		}
		return { ok: false, reason: "transactions-not-supported" };
	}
	catch {
		return { ok: false, reason: "topology-check-failed" };
	}
}
