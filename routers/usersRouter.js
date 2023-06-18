const express = require("express")
const usersBLL = require("../BLL/usersBLL")
const userMiddleware = require("../middleware/userMiddleware")

const router = express.Router()
//every router gets userMiddleware.verifyToken exept login and logout

router.post("/login", userMiddleware.isAuth, usersBLL.login)

router.get("/logout", usersBLL.logout)

//showing page aciton
//Get users
router.get(
	"/",
	userMiddleware.verifyToken,
	userMiddleware.getAllUsers,
	userMiddleware.tookAction,
	userMiddleware.doLogout,
	async (req, res) => {
		try {
			const { users } = req
			res.status(200).json(users)
		} catch (err) {
			console.error(err)
			res.status(500).send(err.message)
		}
	}
)
//getting user by id
router.get("/:id", userMiddleware.verifyToken, async (req, res) => {
	try {
		const { id } = req.params
		const user = await usersBLL.getUserById(id)
		res.json(user)
	} catch (error) {
		console.log(error)
		res.status(500).send(error.message)
	}
})

module.exports = router
