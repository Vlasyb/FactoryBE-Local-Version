const User = require("../models/userModel")
const jwt = require("jsonwebtoken")
const usersWS = require("../DAL/usersWS")
const usersBLL = require("../BLL/usersBLL")
const usersActionsFile = require("../DAL/usersActionsFile")
const secret = process.env.ACCESS_TOKEN_SECRET

//check if user exists in json place holders
const isAuth = async (req, res, next) => {
	const { userEmail, userUsername } = req.body
	const { data: users } = await usersWS.getAllUsers()

	//check if user exists
	let userExists = false
	let userAuth = null

	users.forEach((user) => {
		if (user.username == userUsername && user.email == userEmail) {
			userExists = true
			userAuth = user
			return
		}
	})

	if (!userExists) {
		return res.status(401).json({ message: "Invalid Username or/and Email" })
	}
	actionsLeft = await usersBLL.getActionsLeftById(userAuth.id)
	const fullUser = await usersBLL.getUserById(userAuth.id)
	if (actionsLeft === null) {
		req.body.user = fullUser
		next()
		return
	}
	if (actionsLeft <= 0) {
		return res.json({ message: "No actions left for user" })
	}
	req.body.user = fullUser
	next()
}

//get all users as middleware
const getAllUsers = async (req, res, next) => {
	try {
		const { data: usersWSData } = await usersWS.getAllUsers()
		const users = []
		await Promise.all(
			usersWSData.map(async (userWS) => {
				const userDB = await User.findOne({ RESTid: userWS.id })
				const actionAllowd = await usersBLL.getActionsLeftById(userWS.id)
				const newUser = {
					objectID: userDB._id,
					id: userWS.id,
					username: userWS.username,
					fullName: userWS.name,
					maxActions: userDB.numOfActions,
					actionsLeft:
						actionAllowd == null ? userDB.numOfActions : actionAllowd,
				}
				users.push(newUser)
			})
		) // writing comment here in case you forgot you used it somewhere else, so you know the whole thing is fucked
		req.users = users
		next()
	} catch (error) {
		console.log(error)
	}
}
//checks if user has actions left, if not logs out
const doLogout = async (req, res, next) => {
	try {
		const { logout } = req
		console.log("logout: ", logout)
		if (logout) {
			console.log("Logging out")
			res.cookie("token", "none", {
				maxAge: 0,
				httpOnly: true,
			})
			// res.status(200).json({ message: "User logged out successfully" })
		}
		next()
	} catch (err) {
		console.log("error ", err)
	}
}

//when this middleware is called, means the user made an action
const tookAction = async (req, res, next) => {
	try {
		const { user } = req
		const todaysDate = getTodaysDate()
		const actionAllowd = await usersBLL.getActionsLeftById(user.id)
		const actionsLeft = actionAllowd == null ? user.maxActions : actionAllowd
		const newAction = {
			id: user.id,
			maxActions: user.maxActions,
			date: todaysDate,
			actionAllowd: actionsLeft - 1,
		}
		if (newAction.actionAllowd <= 0) {
			req.logout = true
		}
		// Retrieve the existing actions from the JSON file and add the new action
		const actionsFile = await usersActionsFile.getActions()
		actionsFile.actions.push(newAction)
		// Update the actions in the JSON file
		await usersActionsFile.setActions(actionsFile)
		next()
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: "Internal Server Error" })
	}
}
//getting todays date in dd/mm/yyyy format
const getTodaysDate = () => {
	const today = new Date()
	const day = String(today.getDate()).padStart(2, "0")
	const month = String(today.getMonth() + 1).padStart(2, "0")
	const year = today.getFullYear()
	return `${day}/${month}/${year}`
}

// const verifyTokenLocalStorage = async (req, res, next) => {
// 	//Bearer TOKEN
// 	const authHeader = req.headers["authorization"]
// 	if (!authHeader) {
// 		return res.status(401).json({ message: "No token provided" })
// 	}
// 	const token = authHeader.split(" ")[1]
// 	jwt.verify(token, secret),
// 		(err, user) => {
// 			if (err) {
// 				return res.status(403).json({ message: "failed to authenticate token" })
// 			}
// 			req.user = user
// 			next()
// 		}
// }

//verifying jwt token
const verifyToken = async (req, res, next) => {
	const { token } = req.cookies
	if (!token) return res.status(401).json({ message: "Token required" })
	jwt.verify(token, secret, (err, user) => {
		if (err) {
			return res.status(403).json({ message: "failed to authenticate token" })
		}
		req.user = user
		next()
	})
}

module.exports = {
	isAuth,
	verifyToken,
	tookAction,
	getAllUsers,
	doLogout,
}
