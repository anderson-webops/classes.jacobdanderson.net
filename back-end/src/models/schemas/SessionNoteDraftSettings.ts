import { model, Schema } from "mongoose";

const schema = new Schema({
	_id: { type: String, default: "session-note-drafting" },
	tutorsEnabled: { type: Boolean, default: false, required: true },
	changes: [{
		_id: false,
		actorId: { type: String, required: true },
		at: { type: Date, required: true },
		tutorsEnabled: { type: Boolean, required: true }
	}]
}, { timestamps: true, autoCreate: false, autoIndex: false });

export const SessionNoteDraftSettings = model("SessionNoteDraftSettings", schema);
