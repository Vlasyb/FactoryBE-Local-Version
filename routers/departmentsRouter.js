const express = require("express")
const departmentsBLL = require("../BLL/departmentsBLL")
const userMiddleware = require("../middleware/userMiddleware")

const router = express.Router()

router.get("/", userMiddleware.verifyToken, async (req, res) => {
	try {
		const departments = await departmentsBLL.getAllDepartments()
		res.json(departments)
	} catch (error) {
		console.log(error)
		res.status(500).send(error.message)
	}
})
//get department by id
router.get("/:id", userMiddleware.verifyToken, async (req, res) => {
	try {
		const { id } = req.params
		const department = await departmentsBLL.getDepartmentById(id)
		res.json(department)
	} catch (error) {
		console.log(error)
		res.status(500).send(error.message)
	}
})
//getting all manager ids
router.get("/managers/ids", userMiddleware.verifyToken, async (req, res) => {
	try {
		const managerIds = await departmentsBLL.getAllManagersIds()
		res.json(managerIds)
	} catch (error) {
		console.log(error)
		res.status(500).send(error.message)
	}
})
//get table of department name-manager-employees ACTION showing page
router.get(
	"/table/allRows",
	userMiddleware.verifyToken,
	userMiddleware.tookAction,
	userMiddleware.doLogout,
	async (req, res) => {
		try {
			const departmentRows = await departmentsBLL.getAllDepartmentRows()
			res.json(departmentRows)
		} catch (error) {
			console.error("Error in retrieving department rows:", error)
			res.status(500).json({ error: "Error in retrieving department rows" })
		}
	}
)
//get department id by name
router.get("/nametoid/:name", userMiddleware.verifyToken, async (req, res) => {
	try {
		const { name } = req.params
		const departmentid = await departmentsBLL.getDepartmentIdByName(name)
		res.json(departmentid)
	} catch (error) {
		console.error("Error in retrieving department rows:", error)
		res.status(500).json({ error: "Error in retrieving department rows" })
	}
})
//get department name by id
router.get("/idtoname/:id", userMiddleware.verifyToken, async (req, res) => {
	try {
		const { id } = req.params
		const departmentName = await departmentsBLL.getDepartmentNamebyId(id)
		res.json(departmentName)
	} catch (error) {
		console.error("Error in retrieving department rows:", error)
		res.status(500).json({ error: "Error in retrieving department rows" })
	}
})
//update department by id ACTION
router.put(
	"/:id",
	userMiddleware.verifyToken,
	userMiddleware.tookAction,
	userMiddleware.doLogout,
	async (req, res) => {
		try {
			const { id } = req.params
			const obj = req.body
			result = await departmentsBLL.updateDepartment(id, obj)
			res.json(result)
		} catch (error) {
			console.log(error)
			return res.status(500).send(error.message)
		}
	}
)
//delete department by id ACTION
router.delete(
	"/:id",
	userMiddleware.verifyToken,
	userMiddleware.tookAction,
	userMiddleware.doLogout,
	async (req, res) => {
		try {
			const { id } = req.params
			result = await departmentsBLL.deleteDepartment(id)
			res.json(result)
		} catch (error) {
			console.log(error)
			return res.status(500).send(error.message)
		}
	}
)
//add department ACTION
router.post(
	"/",
	userMiddleware.verifyToken,
	userMiddleware.tookAction,
	userMiddleware.doLogout,
	async (req, res) => {
		try {
			const obj = req.body
			const result = await departmentsBLL.addDepartment(obj)
			res.json(result)
		} catch (error) {
			console.log(error)
			return res.status(500).send(error.message)
		}
	}
)

module.exports = router
