const axios = require("axios")
const url = "https://jsonplaceholder.typicode.com/users"

const getAllUsers = () => {
	return axios.get(url)
}

const getUser = (id) => {
	return axios.get(`${url}/${id}`)
}

module.exports = { getAllUsers, getUser }
