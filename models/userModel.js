const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
	{
		RESTid: { type: Number, required: true },
		fullName: { type: String, required: true },
		numOfActions: { type: Number, required: true },
	},
	{ versionKey: false }
)

const User = mongoose.model("users", userSchema)

module.exports = User
