import { Request, Response } from "express"
import Note, { INote } from "../@models/Note"
import { Types } from "mongoose"

type NoteParams = {
    noteId: Types.ObjectId
}

export class NoteController {
    static createNote = async (req: Request<{}, {}, INote>, res: Response) => {
        const { content } = req.body

        // create note
        const note = new Note()
        note.content = content
        note.createdBy = req.user.id
        note.task = req.task.id

        //add the note to the task
        req.task.notes.push(note.id)
        
        try {
            await Promise.all([note.save(), req.task.save()])
            res.send('Nota creada correctamente')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static getTaskNotes = async (req: Request, res: Response) => {
        try {
            const notes = await Note.find({task: req.task.id})
            res.json(notes)
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static deleteNote = async (req: Request<NoteParams>, res: Response) => {
        const { noteId } = req.params
        const note = await Note.findById(noteId)

        // check if the note exists
        if (!note) {
            const error = new Error('Nota no encontrada')
            res.status(404).json({error: error.message})
            return
        }

        // check if the note belongs to the user
        if (note.createdBy.toString() !== req.user.id.toString()) {
            const error = new Error('No tienes permisos para eliminar esta nota')
            res.status(401).json({error: error.message})
            return
        }

        //delete note from task
        req.task.notes = req.task.notes.filter(note => note.toString() !== noteId.toString())

        try {
            await Promise.allSettled([note.deleteOne(), req.task.save()])
            res.send('Nota eliminada')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }
}

