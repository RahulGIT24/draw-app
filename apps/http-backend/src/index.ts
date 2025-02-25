import express from "express"
import cors from "cors"

const app = express();

app.use(express.json())
app.use(cors(
    {   
        origin: "*"
    }
))

const PORT = 5000

app.get("/health-check", (req, res) => {
    res.send('Health Checked')
})

// import routes
import authRouter from "./routes/auth.routes"
import roomRouter from "./routes/room.routes"
import shapeRouter from "./routes/shape.routes"

app.use("/",authRouter)
app.use("/",roomRouter)
app.use("/",shapeRouter)

app.listen(PORT, () => {
    console.log(`Http Backend Listening on ${PORT}`)
})
