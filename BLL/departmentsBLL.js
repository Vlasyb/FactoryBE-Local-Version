const Employee = require("../models/employeeModel")
const Department = require("../models/departmentModel")
const employeesBLL = require("./employeesBLL")

const getAllDepartments = () => {
	return Department.find({})
}

const getDepartmentById = (id) => {
	return Department.findOne({ _id: id })
}

const getAllManagersIds = async () => {
	const departments = await Department.find({ manager: { $ne: null } }).select(
		"manager"
	)
	const managerIds = departments.map((department) => department.manager)
	return managerIds
}

const addDepartment = async (obj) => {
	const department = new Department(obj)
	await department.save()
	return "Created"
}

const getDepartmentIdByName = async (departmentName) => {
	const department = await Department.findOne({ name: departmentName })
	return department ? department._id : null
}
const getDepartmentNamebyId = async (departmentId) => {
	const department = await Department.findOne({ _id: departmentId })
	return department ? department.name : null
}

const updateDepartment = async (id, obj) => {
	await Department.findByIdAndUpdate(id, obj)
	return "Updated"
}

const deleteDepartment = async (id) => {
	//will also remove all employees associated
	let result = "Deleted , no employees associated"
	await Department.findByIdAndDelete(id)
	const employeesToDelete = await Employee.find({
		departmentID: id,
	})
	const employeeIdsToDelete = employeesToDelete.map((employee) => employee._id)
	const deletedEmployeeResult = await Employee.deleteMany({
		_id: { $in: employeeIdsToDelete },
	})
	if (deletedEmployeeResult.deletedCount > 0) {
		result = `Deleted ${deletedEmployeeResult.deletedCount} employees`
	}
	return result
}

const getAllDepartmentRows = async () => {
	const allDepartments = await getAllDepartments()
	const departmentRows = await Promise.all(
		allDepartments.map(async (department) => {
			let managerName = "N/A"
			if (department.manager) {
				const manager = await employeesBLL.getEmployeeById(department.manager)
				managerName = `${manager.firstName} ${manager.lastName}`
			}

			const employees = await Employee.find({ departmentID: department._id })
			const employeeNames = employees.map((employee) => {
				return {
					fullName: `${employee.firstName} ${employee.lastName}`,
				}
			})

			const departmentRow = {
				departmentName: department.name,
				managerName: managerName,
				employees: employeeNames,
			}
			return departmentRow
		})
	)
	return departmentRows
}

module.exports = {
	getAllManagersIds,
	getDepartmentNamebyId,
	getDepartmentIdByName,
	getAllDepartmentRows,
	addDepartment,
	updateDepartment,
	deleteDepartment,
	getAllDepartments,
	getDepartmentById,
}
