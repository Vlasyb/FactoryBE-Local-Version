const mongoose = require("mongoose")

const departmentSchema = mongoose.Schema(
	{
		name: { type: String, required: true },
		manager: { type: mongoose.SchemaTypes.ObjectId, ref: "employees" }, //reference to emloyee id
	},
	{ versionKey: false }
)

const Department = mongoose.model("departments", departmentSchema)

module.exports = Department
