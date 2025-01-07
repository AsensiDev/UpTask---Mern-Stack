import mongoose, { Schema, Document, PopulatedDoc, Types } from 'mongoose'
import { ITask } from './Task'

// tipado de typescript
export interface IProject extends Document {
    projectName: string
    clientName: string
    description: string
    tasks: PopulatedDoc<ITask & Document>[]
}

//schema para la db de mongoose
const ProjectSchema: Schema = new Schema({
    projectName: {
        type: String,
        required: true,
        trim: true
    },
    clientName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    tasks: [
        {
            type: Types.ObjectId,
            ref: 'Task'
        }
    ]
}, {timestamps: true})

// crea modelo llamado Project utilizando el esquema ProjectSchema
const Project = mongoose.model<IProject>('Project', ProjectSchema)
export default Project