import { Request, Response, NextFunction } from "express"
import Task, { ITask } from "../@models/Task";

declare global {
    namespace Express {
        interface Request {
            task: ITask
        }
    }
}

export async function taskExists( req: Request, res: Response, next: NextFunction) {
    try {
        const { taskId } = req.params
        // buscamos tarea por su id
        const task = await Task.findById(taskId)
        // validamos si la tarea existe
        if(!task) {
            res.status(404).json({ error: 'Tarea no encontrada' });
            return
        }
        req.task = task
        next()
    } catch (error) {
        res.status(500).json({error: 'Hubo un error'})
    }
}

export async function taskBelongsToProject( req: Request, res: Response, next: NextFunction) {
    
    if(req.task.project.toString() !== req.project.id.toString()) {
        const error = new Error('La Tarea no Existe en el Proyecto')
        res.status(400).json({error: error.message})
        return
    }
    next()
}

export async function hasAuthorization( req: Request, res: Response, next: NextFunction) {
    
    if(req.user.id.toString() !== req.project.manager.toString()) {
        const error = new Error('La Tarea no Existe en el Proyecto')
        res.status(400).json({error: error.message})
        return
    }
    next()
}