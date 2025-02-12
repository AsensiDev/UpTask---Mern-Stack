import { Task } from "@/types/index";
import AddNoteForm from "./AddNoteForm";
import NoteDetail from "./NoteDetail";

type NotesPanelProps = {
    notes: Task['notes']
}

export default function NotesPanel({notes} : NotesPanelProps) {
  return (
    <>
        <AddNoteForm />

        <div className="divide-y divide-gray-100 mt-10">
            {notes.length ? (
                <>
                    <p className="text-slate-600 my-5">
                        {notes.map(note => <NoteDetail key={note._id} note={note} />)}
                    </p>
                </>   
            ) : <p className="text-gray-500 text-center pt-3">No hay notas</p>}
        </div>
    </>
  )
}
