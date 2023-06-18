const employeesRouter = require("./routers/employeesRouter")
const departmentsRouter = require("./routers/departmentsRouter")
const shiftsRouter = require("./routers/shiftsRouter")
const usersRouter = require("./routers/usersRouter")
const cookieparser = require("cookie-parser")

const express = require("express")
const cors = require("cors")

const connectDB = require("./configs/DB")

const app = express()
const port = 8080
// login branch
connectDB()

app.use(cors({ origin: [`http://localhost:3000`], credentials: true }))
app.use(express.json())
app.use(cookieparser())

// Routers ------------------- ++++++++
app.use("/employees", employeesRouter)
app.use("/departments", departmentsRouter)
app.use("/shifts", shiftsRouter)
app.use("/users", usersRouter)

app.listen(port, () => {
	console.log(`app is listening at http://localhost:${port}`)
})
