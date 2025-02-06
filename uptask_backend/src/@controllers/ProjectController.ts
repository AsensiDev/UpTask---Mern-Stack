import type { Request, Response } from 'express'
import Project from '../@models/Project'

export class ProjectController {

    static createProject = async (req: Request, res: Response) => {
        const project = new Project(req.body)

        // asign a manager to a roject
        project.manager = req.user.id
        
        console.log(req.user)
        try {
            await project.save()
            res.send('Proyecto Creado Correctamente')
        } catch (error) {
            console.log(error)
        }
    }
    
    static getAllProjects = async (req: Request, res: Response) => {
        try {
            // get projects of one user
            const projects = await Project.find({
                $or: [
                    {manager: {$in: req.user.id}}
                ]
            })
            res.json(projects)
        } catch (error) {
            console.log(error)
        }
    }

    static getProjectById = async (req: Request, res: Response) => {
        try {
            const project = await Project.findById(req.params.id).populate('tasks')
            if(!project) {
                const error = new Error('Proyecto no Encontrado')
                res.status(404).json({error: error.message})
                return
            }

            // check if the user is the creator of the project
            if(project.manager.toString() !== req.user.id.toString()) {
                const error = new Error('Acción no válida')
                res.status(404).json({error: error.message})
                return
            }
            res.json(project)
        } catch (error) {
            console.log(error)
        }
    }

    static updateProject = async (req: Request, res: Response) => {
        try {
            const project = await Project.findById(req.params.id)
            if(!project) {
                const error = new Error('Proyecto no Encontrado')
                res.status(404).json({error: error.message})
                return
            }
            if(project.manager.toString() !== req.user.id.toString()) {
                const error = new Error('Solo el mánager puede actualizar un proyecto')
                res.status(404).json({error: error.message})
                return
            }
            project.clientName = req.body.clientName
            project.projectName = req.body.projectName
            project.description = req.body.description
            await project.save()
            res.send('Proyecto Actualizado')
        } catch (error) {
            console.log(error)
        }
    }

    static deleteProjectById = async (req: Request, res: Response) => {
        try {
            const project = await Project.findById(req.params.id)
            await project.deleteOne()

            if(!project) {
                const error = new Error('Proyecto no Encontrado')
                res.status(404).json({error: error.message})
                return
            }

            if(project.manager.toString() !== req.user.id.toString()) {
                const error = new Error('Solo el mánager puede eliminar un proyecto')
                res.status(404).json({error: error.message})
                return
            }

            res.send('Proyecto Eliminado')
        } catch (error) {
            console.log(error)
        }
    }
}

