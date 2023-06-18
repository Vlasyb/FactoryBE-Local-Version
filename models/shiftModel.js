const mongoose = require("mongoose")

const shiftSchema = mongoose.Schema(
	{
		date: { type: Date, default: () => Date.now() },
		startingHour: { type: Number, required: true },
		endingHour: { type: Number, required: true },
		employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
	},
	{ versionKey: false }
)

const Shift = mongoose.model("shifts", shiftSchema)

module.exports = Shift
