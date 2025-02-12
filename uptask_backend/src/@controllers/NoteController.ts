import { Request, Response } from "express"
import Note, { INote } from "../@models/Note"

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
}

