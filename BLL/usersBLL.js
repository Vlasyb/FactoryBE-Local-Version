require("dotenv").config()
const User = require("../models/userModel")
const jwt = require("jsonwebtoken")
const usersWS = require("../DAL/usersWS")
const usersActionsFile = require("../DAL/usersActionsFile")

const getUserById = async (id) => {
	const userDB = await User.findOne({ RESTid: id })
	const { data: userWS } = await usersWS.getUser(id)
	const actionAllowd = await getActionsLeftById(userWS.id)
	const user = {
		objectID: userDB._id,
		id: userWS.id,
		username: userWS.username,
		fullName: userWS.name,
		maxActions: userDB.numOfActions,
		actionsLeft: actionAllowd == null ? userDB.numOfActions : actionAllowd,
	}
	return user
}

//if returns Null -> no actions taken today
const getActionsLeftById = async (id) => {
	const usersFile = await usersActionsFile.getActions()
	actions = usersFile.actions

	let lastDateObj = null
	actions.map((action) => {
		if (action.id == id) {
			lastDateObj = action
		}
	})

	if (lastDateObj == null) return lastDateObj
	//check if the date is today
	console.log(lastDateObj)
	splittedDate = lastDateObj.date.split("/")
	currentDate = new Date()
	if (
		splittedDate[0] == currentDate.getDate() &&
		splittedDate[1] == currentDate.getMonth() + 1 &&
		splittedDate[2] == currentDate.getFullYear()
	) {
		return lastDateObj.actionAllowd
	}
	return null
}

const login = async (req, res) => {
	//after user is authenticated

	const user = req.body.user

	const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "2h",
	})
	res.cookie("token", accessToken, {
		maxAge: 1800000,
		httpOnly: true,
	})
	res.status(200).json({
		message: "successfully logged in",
		accessToken: accessToken,
		user,
	})
}

const logout = async (req, res) => {
	res.cookie("token", "none", {
		maxAge: 0,
		httpOnly: true,
	}),
		res.status(200).json({ message: "User logged out successfully" })
}

module.exports = {
	getUserById,
	login,
	getActionsLeftById,
	logout,
}
