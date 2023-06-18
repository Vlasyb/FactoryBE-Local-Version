const jsonfile = require("jsonfile")
const path = require("path")

const file = path.join(__dirname, "../data/actions.json")

const getActions = () => {
	return jsonfile.readFile(file)
}

const setActions = async (obj) => {
	try {
		await jsonfile.writeFile(file, obj)
		return true
	} catch (error) {
		console.error("Error writing file:", error)
		return false
	}
}

module.exports = { getActions, setActions }
