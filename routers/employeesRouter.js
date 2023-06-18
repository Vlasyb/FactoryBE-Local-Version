const express = require("express")
const employeesBLL = require("../BLL/employeesBLL")
const userMiddleware = require("../middleware/userMiddleware")
const router = express.Router()

//add userMiddleware.verifyToken to every function exept logout

//part of page ACTION
//get all employees
router.get(
	"/",
	userMiddleware.verifyToken,
	userMiddleware.tookAction,
	userMiddleware.doLogout,
	async (req, res) => {
		try {
			const employees = await employeesBLL.getAllEmployees()
			res.json(employees)
		} catch (error) {
			console.log(error)
			res.status(500).send(error.message)
		}
	}
)
//not an action
//get employee by id
router.get("/:id", userMiddleware.verifyToken, async (req, res) => {
	try {
		const { id } = req.params
		const employee = await employeesBLL.getEmployeeById(id)
		res.json(employee)
	} catch (error) {
		console.log(error)
		res.status(500).send(error.message)
	}
})
//get rows by id of employees ACTION
router.get(
	"/rowsbyids/:employeeIds",
	userMiddleware.verifyToken,
	userMiddleware.tookAction,
	userMiddleware.doLogout,
	async (req, res) => {
		const employeeIds = req.params.employeeIds.split(",") // EmployeeIds are comma-seperated values
		try {
			const employeeRows = await employeesBLL.getEmployeeRows(employeeIds)
			res.json(employeeRows)
		} catch (error) {
			console.error("Error in retrieving employee rows:", error)
			res.status(500).json({ error: "Error in retrieving employee rows" })
		}
	}
)
//not an action
//get employee id by his fullname
router.get("/nametoid/:name", userMiddleware.verifyToken, async (req, res) => {
	try {
		const { name } = req.params
		const employeeId = await employeesBLL.getEmployeeIdByName(name)
		res.json(employeeId)
	} catch (error) {
		console.error("Error in retrieving employee id:", error)
		res.status(500).json({ error: "Error in retrieving employee id" })
	}
})
//showing page action
//get all employees that dont belong to department id to allocate them if needed
router.get(
	"/dontbelong/:departmentid",
	userMiddleware.verifyToken,
	userMiddleware.tookAction,
	userMiddleware.doLogout,
	async (req, res) => {
		try {
			const { departmentid } = req.params
			const employees =
				await employeesBLL.getEmployeesThatDontBelongToDepartment(departmentid)
			res.json(employees)
		} catch (error) {
			console.error("Error in retrieving department rows:", error)
			res.status(500).json({ error: "Error in retrieving department rows" })
		}
	}
)
// part of page (not an action)
//retrieving employee ids by department name
router.get(
	"/department/:departmentName",
	userMiddleware.verifyToken,
	async (req, res) => {
		const departmentName = req.params.departmentName
		try {
			const employees = await employeesBLL.getEmployeeIdsByDepartmentName(
				departmentName
			)
			res.json(employees)
		} catch (error) {
			console.error("Error in retrieving employees:", error)
			res.status(500).json({ error: "Failed to retrieve employees" })
		}
	}
)
//get worked shifts for employee by id ACTION - part of page
router.get(
	"/shifts/:id",
	userMiddleware.verifyToken,
	userMiddleware.tookAction,
	userMiddleware.doLogout,
	async (req, res) => {
		const { id } = req.params
		try {
			const shifts = await employeesBLL.findShiftsForEmployee(id)
			res.json(shifts)
		} catch (error) {
			console.error("Error in retrieving employees:", error)
			res.status(500).json({ error: "Failed to retrieve employees" })
		}
	}
)
// part of page (not an action)
//get available shifts for employee by id
router.get(
	"/availableShifts/:id",
	userMiddleware.verifyToken,
	userMiddleware.tookAction,
	userMiddleware.doLogout,
	async (req, res) => {
		const { id } = req.params
		try {
			const shifts = await employeesBLL.findShiftsAvailableForEmployee(id)
			res.json(shifts)
		} catch (error) {
			console.error("Error in retrieving employees:", error)
			res.status(500).json({ error: "Failed to retrieve employees" })
		}
	}
)
//allocating emloyee to department by getting employee id and deparment id ACTION
router.put(
	"/:employeeId/:departmentId",
	userMiddleware.verifyToken,
	userMiddleware.tookAction,
	userMiddleware.doLogout,
	async (req, res) => {
		const { employeeId, departmentId } = req.params
		try {
			const updatedEmployee = await employeesBLL.allocateEmployeeToDepartment(
				employeeId,
				departmentId
			)
			res.json(updatedEmployee)
		} catch (error) {
			console.error("Error in allocating employee department:", error)
			res.status(500).json({ error: "Failed to alocate employee department" })
		}
	}
)
//updating employee with given id ACTION
router.put(
	"/:id",
	userMiddleware.verifyToken,
	userMiddleware.tookAction,
	userMiddleware.doLogout,
	async (req, res) => {
		try {
			const { id } = req.params
			const obj = req.body
			result = await employeesBLL.updateEmployee(id, obj)
			res.json(result)
		} catch (error) {
			console.log(error)
			return res.status(500).send(error.message)
		}
	}
)
//deleting employee with given id ACTION
router.delete(
	"/:id",
	userMiddleware.verifyToken,
	userMiddleware.tookAction,
	userMiddleware.doLogout,
	async (req, res) => {
		try {
			const { id } = req.params
			result = await employeesBLL.deleteEmployee(id)
			res.json(result)
		} catch (error) {
			console.log(error)
			return res.status(500).send(error.message)
		}
	}
)
//Adding employee ACTION
router.post(
	"/",
	userMiddleware.verifyToken,
	userMiddleware.tookAction,
	userMiddleware.doLogout,
	async (req, res) => {
		try {
			const obj = req.body
			const result = await employeesBLL.addEmployee(obj)
			res.json(result)
		} catch (error) {
			console.log(error)
			return res.status(500).send(error.message)
		}
	}
)

module.exports = router
