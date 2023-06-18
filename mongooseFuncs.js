const mongoose = require("mongoose")
const User = require("./models/userModel")
const Employee = require("./models/employeeModel")
const Department = require("./models/departmentModel")
const Shift = require("./models/shiftModel")
const createUser = async () => {
	try {
		// const user = new User({ fullName: "Kyle Jenner", numOfActions: 20 })
		// await user.save()
		const user = await User.create({
			RESTid: 10,
			fullName: "Clementina DuBuque",
			numOfActions: 4,
		})
		console.log(user)
	} catch (e) {
		console.log(e.message)
	}
}
const createEmployee = async () => {
	try {
		const employee = await Employee.create({
			firstName: "Rollo",
			lastName: "Tommassi",
			startWorkYear: 1960,
		})
		console.log(employee)
	} catch (e) {
		console.log(e.message)
	}
}
const createDepartment = async () => {
	try {
		const department = await Department.create({
			name: "test-department",
			// manager: "647ebe8c525d167a5aa28879",
		})
		console.log(department)
	} catch (e) {
		console.log(e.message)
	}
}
const addDepartmentToEmployee = async (departmentIDtoSet, employeeID) => {
	const employee = await Employee.findById(employeeID)
	Employee.updateOne(
		{ _id: employeeID },
		{ $set: { departmentID: departmentIDtoSet } }
	)
		.then(() => {
			console.log("Field updated successfully.")
			console.log(employee)
		})
		.catch((error) => {
			console.error("Error updating field:", error)
		})
}
const addEmployeeToShift = async (employeeID, shiftID) => {
	try {
		const shiftId = shiftID // Replace 'Shift ID' with the actual ID of the shift
		const shift = await Shift.findById(shiftId)

		if (!shift) {
			console.log("Shift not found")
			return
		}

		const newEmployeeId = employeeID // Replace 'New Employee ID' with the actual ID of the new employee

		shift.employees.push(newEmployeeId)

		const updatedShift = await shift.save()
		console.log(updatedShift)
	} catch (e) {
		console.log(e.message)
	}
}
const createShift = async () => {
	try {
		const shift = await Shift.create({
			date: new Date("2023-03-03"),
			startingHour: 11,
			endingHour: 20,
			employees: ["647811ebb91b11f40a728379"],
		})
		console.log(shift)
	} catch (e) {
		console.log(e.message)
	}
}
// addDepartmentToEmployee("647ebeb1fe61756905452bbd", "647ebe8c525d167a5aa28879")
// createUser()
// createDepartment()
// createShift()
// createEmployee()
// addEmployeeToShift("6478111e79e5a5e3fbac3e8a", "647825edf63bd91cf4acf508")
