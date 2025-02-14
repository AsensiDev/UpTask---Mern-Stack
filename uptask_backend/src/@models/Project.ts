import mongoose, { Schema, Document, PopulatedDoc, Types } from 'mongoose'
import Task, { ITask } from './Task'
import { IUser } from './User'
import Note from './Note'

// tipado de typescript
export interface IProject extends Document {
    projectName: string
    clientName: string
    description: string
    tasks: PopulatedDoc<ITask & Document>[]
    manager: PopulatedDoc<IUser & Document>
    team: PopulatedDoc<IUser & Document>[]
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
    ],
    manager: {
        type: Types.ObjectId,
        ref: 'User'
    },
    team: [
        {
            type: Types.ObjectId,
            ref: 'User'
        }
    ],
}, {timestamps: true})

// middleware
ProjectSchema.pre('deleteOne', {
    document: true,
    query: false
}, async function() {
    const projectId = this._id
    if(!projectId) return

    const tasks = await Task.find({project: projectId})
    for(const task of tasks) {
        await Note.deleteMany({task: task.id})
    }
    
    await Task.deleteMany({project: projectId})
})

// crea modelo llamado Project utilizando el esquema ProjectSchema
const Project = mongoose.model<IProject>('Project', ProjectSchema)
export default Project