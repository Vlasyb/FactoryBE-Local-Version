const express = require("express")
const shiftsBLL = require("../BLL/shiftsBLL")
const userMiddleware = require("../middleware/userMiddleware")

const router = express.Router()

//showing page aciton
router.get(
	"/",
	userMiddleware.verifyToken,
	userMiddleware.tookAction,
	userMiddleware.doLogout,
	async (req, res) => {
		try {
			const shifts = await shiftsBLL.getAllShifts()
			res.json(shifts)
		} catch (error) {
			console.log(error)
			res.status(500).send(error.message)
		}
	}
)
//geting shift by id
router.get("/:id", userMiddleware.verifyToken, async (req, res) => {
	try {
		const { id } = req.params
		const shift = await shiftsBLL.getShiftById(id)
		res.json(shift)
	} catch (error) {
		console.log(error)
		res.status(500).send(error.message)
	}
})
//getting all the employees that dont belong to shift by shift id
router.get(
	"/notInShift/:shiftId",
	userMiddleware.verifyToken,
	async (req, res) => {
		try {
			const { shiftId } = req.params
			const shift = await shiftsBLL.getEmployeesThatDontBelongToShift(shiftId)
			res.json(shift)
		} catch (error) {
			console.log(error)
			res.status(500).send(error.message)
		}
	}
)
//creating shift ACTION
router.post(
	"/",
	userMiddleware.verifyToken,
	userMiddleware.tookAction,
	userMiddleware.doLogout,
	async (req, res) => {
		try {
			const obj = req.body
			const result = await shiftsBLL.addShift(obj)
			res.json(result)
		} catch (error) {
			console.log(error)
			return res.status(500).send(error.message)
		}
	}
)
//adding employee to shift with shift id and employee id ACTION
router.put(
	"/:shiftid/:employeeid",
	userMiddleware.verifyToken,
	userMiddleware.tookAction,
	userMiddleware.doLogout,
	async (req, res) => {
		try {
			const { shiftid, employeeid } = req.params
			const updatedShift = await shiftsBLL.addEmployeeToShift(
				shiftid,
				employeeid
			)
			res.json(updatedShift)
		} catch (error) {
			console.log(error)
			return res.status(500).send(error.message)
		}
	}
)
//update shift ACTION
router.put(
	"/:id",
	userMiddleware.verifyToken,
	userMiddleware.tookAction,
	userMiddleware.doLogout,
	async (req, res) => {
		try {
			const { id } = req.params
			const obj = req.body
			result = await shiftsBLL.updateShift(id, obj)
			res.json(result)
		} catch (error) {
			console.log(error)
			return res.status(500).send(error.message)
		}
	}
)

module.exports = router
