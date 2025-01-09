import express from "express"
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import { corsConfig } from "./config/cors"
import { connectDB } from "./config/db"
import projectRoutes from './routes/projectRoutes'

dotenv.config() // hacemos que pueda tomar las variables de entorno
connectDB()
const app = express() 
app.use(cors(corsConfig))
app.use(morgan('dev')) // ver todas las consultas por consola
app.use(express.json()) // hacer que acepte el formato json para las peticiones

// routes
app.use('/api/projects', projectRoutes)


export default app