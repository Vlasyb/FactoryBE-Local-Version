const mongoose = require("mongoose")

const employeeSchema = mongoose.Schema(
	{
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		startWorkYear: { type: Number, required: true },
		departmentID: { type: mongoose.SchemaTypes.ObjectId, ref: "departments" },
	},
	{ versionKey: false }
)

const Employee = mongoose.model("employees", employeeSchema)

module.exports = Employee
