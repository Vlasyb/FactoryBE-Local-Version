const Employee = require("../models/employeeModel")
const Department = require("../models/departmentModel")
const Shift = require("../models/shiftModel")
// const departmentsBLL = require("./departmentsBLL") will cause error of circular dependency , if needed do inside a function

const getAllEmployees = () => {
	return Employee.find({})
}

const getAllEmployeeIds = async () => {
	const employees = await Employee.find({}).select("_id")
	return employees
}

const getEmployeeById = (id) => {
	return Employee.findOne({ _id: id })
}

const getEmployeeIdsByDepartmentName = async (departmentName) => {
	let employees = await getAllEmployeeIds() //if no department is chosen in employees page

	if (departmentName != "stock") {
		const department = await Department.findOne({
			name: { $regex: new RegExp(`^${departmentName}$`, "i") },
		})

		//find employees by departmentID
		employees = await Employee.find({ departmentID: department._id }).select(
			"_id"
		)
	}
	return employees
}

const getEmployeesThatDontBelongToDepartment = async (departmentId) => {
	const employees = await Employee.find({ departmentID: { $ne: departmentId } })
	return employees
}

const allocateEmployeeToDepartment = async (employeeId, departmentId) => {
	await Employee.findByIdAndUpdate(employeeId, { departmentID: departmentId })
	return "Department Allocated"
}

const getEmployeesByIds = (employeeIds) => {
	return Employee.find({ _id: { $in: employeeIds } })
}
const getEmployeeIdByName = async (employeeFullName) => {
	const [firstName, lastName] = employeeFullName.split(" ")
	const employee = await Employee.findOne({
		firstName: firstName,
		lastName: lastName,
	})
	return employee ? employee._id : null
}

const getEmployeeRows = async (employeeIds) => {
	const employees = await getEmployeesByIds(employeeIds)

	//retrieve department info for each employee
	const employeeRows = await Promise.all(
		employees.map(async (employee) => {
			const department = await Department.findOne({
				_id: employee.departmentID,
			})

			const shifts = await Shift.find({ employees: employee._id })

			const shiftsData = shifts.map((shift) => {
				return {
					date: shift.date,
					startingHour: shift.startingHour,
					endingHour: shift.endingHour,
				}
			})

			const employeeRow = {
				fullname: `${employee.firstName} ${employee.lastName}`,
				departmentName: department.name,
				shifts: shiftsData,
			}
			return employeeRow
		})
	)

	return employeeRows
}

const addEmployee = async (obj) => {
	const employee = new Employee(obj)
	await employee.save()
	return "Created"
}

const updateEmployee = async (id, obj) => {
	await Employee.findByIdAndUpdate(id, obj)
	return "Updated"
}

const deleteEmployee = async (id) => {
	//will also delete all shifts associated, but only if the shift is only worked by this specific employee otherwise will just erase the id
	let result = "Deleted, No relevent shifts found"
	await Employee.findByIdAndDelete(id)
	const shiftsToDelete = await Shift.find({
		employees: { $size: 1, $all: [id] },
	})
	const shiftIdsToDelete = shiftsToDelete.map((shift) => shift._id)
	const deletedShiftsResult = await Shift.deleteMany({
		_id: { $in: shiftIdsToDelete },
	})
	if (deletedShiftsResult.deletedCount > 0) {
		result = `Deleted ${deletedShiftsResult.deletedCount} shifts`
	}
	console.log(`${deletedShiftsResult.deletedCount} shifts deleted.`)
	await Shift.updateMany(
		{
			$expr: { $gte: [{ $size: "$employees" }, 2] },
			employees: id,
		},
		{ $pull: { employees: id } }
	)
	return result
}

const findShiftsForEmployee = async (id) => {
	const shifts = await Shift.find({ employees: id })
	return shifts
}
const findShiftsAvailableForEmployee = async (id) => {
	const shifts = await Shift.find({ employees: { $nin: [id] } })
	return shifts
}

module.exports = {
	findShiftsAvailableForEmployee,
	findShiftsForEmployee,
	allocateEmployeeToDepartment,
	getEmployeesThatDontBelongToDepartment,
	deleteEmployee,
	updateEmployee,
	getAllEmployeeIds,
	addEmployee,
	getEmployeeRows,
	getEmployeesByIds,
	getAllEmployees,
	getEmployeeById,
	getEmployeeIdsByDepartmentName,
	getEmployeeIdByName,
}
