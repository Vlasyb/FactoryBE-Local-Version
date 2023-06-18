const Employee = require("../models/employeeModel")
const Shift = require("../models/shiftModel")

const getAllShifts = () => {
	return Shift.find({})
}
const getShiftById = (id) => {
	return Shift.findOne({ _id: id })
}
const addShift = async (obj) => {
	const shift = new Shift(obj)
	await shift.save()
	return "Created"
}

const getEmployeesThatDontBelongToShift = async (shiftId) => {
	const employeesInShift = await Shift.findOne({ _id: shiftId }).select(
		"employees"
	)
	const employeesNotInShift = await Employee.find({
		_id: { $nin: employeesInShift.employees },
	})
	return employeesNotInShift
}

const updateShift = async (id, obj) => {
	await Shift.findByIdAndUpdate(id, obj)
	return "Updated"
}
const addEmployeeToShift = async (shiftid, employeeid) => {
	const shift = await Shift.findById(shiftid)

	if (!shift) {
		throw new Error("Shift not found")
	}

	// Add the employee ID to the shift's employees array
	shift.employees.addToSet(employeeid)

	// Save the updated shift
	const updatedShift = await shift.save()

	return updatedShift
}

module.exports = {
	addEmployeeToShift,
	getEmployeesThatDontBelongToShift,
	getAllShifts,
	getShiftById,
	addShift,
	updateShift,
}
