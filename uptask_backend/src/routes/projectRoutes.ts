import { Router }  from 'express'
import { body, param } from 'express-validator' // body nos permite acceder al cuerpo de la solicitud
import { ProjectController } from '../@controllers/ProjectController'
import { handleInputErrors } from '../middleware/validation'
import { TaskController } from '../@controllers/TaskController'
import { projectExists } from '../middleware/project'
import { hasAuthorization, taskBelongsToProject, taskExists } from '../middleware/task'
import { authenticate } from '../middleware/auth'
import { TeamMemberController } from '../@controllers/TeamController'
import { NoteController } from '../@controllers/NoteController'

const router = Router()

router.use(authenticate)

router.post('/',
    body('projectName')
        .notEmpty().withMessage('El nombre del proyecto es Obligatorio'),
    body('clientName')
        .notEmpty().withMessage('El nombre del cliente es Obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripcion es obligatoria'),
    handleInputErrors,
    ProjectController.createProject
)
router.get('/', ProjectController.getAllProjects)
router.get('/:id',
    param('id')
        .isMongoId().withMessage('ID no Válido'),
    handleInputErrors,
    ProjectController.getProjectById
)

// ejecuta el middleware projectExists siempre que la ruta contenga projectId
router.param('projectId', projectExists)

router.put('/:projectId',
    param('projectId')
        .isMongoId().withMessage('ID no Válido'),
    body('projectName')
        .notEmpty().withMessage('El nombre del proyecto es Obligatorio'),
    body('clientName')
        .notEmpty().withMessage('El nombre del cliente es Obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripcion es obligatoria'),
    handleInputErrors,
    hasAuthorization,
    ProjectController.updateProject
)
router.delete('/:projectId',
    param('projectId')
        .isMongoId().withMessage('ID no Válido'),
    handleInputErrors,
    hasAuthorization,
    ProjectController.deleteProjectById
)

/** Routes for Tasks */


router.post('/:projectId/tasks',
    hasAuthorization,
    body('name')
        .notEmpty().withMessage('El nombre de la Tarea es Obligatorio'),
    body('description')
        .notEmpty().withMessage('La Descripcion de la Tarea es Obligatoria'),
    handleInputErrors,
    TaskController.createTask
)

router.get('/:projectId/tasks',
    TaskController.getProjectTasks
)

router.param('taskId', taskExists)
router.param('taskId', taskBelongsToProject)

router.get('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('Id no Válido'),
    handleInputErrors,
    TaskController.getTaskById
)

router.put('/:projectId/tasks/:taskId',
    hasAuthorization,
    param('taskId').isMongoId().withMessage('Id no Válido'),
    body('name')
        .notEmpty().withMessage('El nombre de la Tarea es Obligatorio'),
    body('description')
        .notEmpty().withMessage('La Descripcion de la Tarea es Obligatoria'),
    handleInputErrors,
    TaskController.updateTask
)

router.delete('/:projectId/tasks/:taskId',
    hasAuthorization,
    param('taskId').isMongoId().withMessage('Id no Válido'),
    handleInputErrors,
    TaskController.deleteTask
)

router.post('/:projectId/tasks/:taskId/status',
    param('taskId').isMongoId().withMessage('Id no Válido'),
    body('status')
        .notEmpty().withMessage('El Estado es Obligatorio'),

    handleInputErrors,
    TaskController.updateTaskStatus
)

/** routes for teams */
router.post('/:projectId/team/find',
    body('email')
        .isEmail().toLowerCase().withMessage('E-mail no válido'),
    handleInputErrors,
    TeamMemberController.findMemberByEmail
)

router.get('/:projectId/team',
    TeamMemberController.getProyectTeam
)

router.post('/:projectId/team',
    body('id')
        .isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    TeamMemberController.addMenberById
)

router.delete('/:projectId/team/:userId',
    param('userId')
        .isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    TeamMemberController.removeMenberById
)

/** routes for notes */
router.post('/:projectId/tasks/:taskId/notes',
    body('content')
        .notEmpty().withMessage('El contenido de la nota es obligatorio'),
    handleInputErrors,
    NoteController.createNote
)

router.get('/:projectId/tasks/:taskId/notes',
    NoteController.getTaskNotes
)

router.delete('/:projectId/tasks/:taskId/notes/:noteId',
    param('noteId')
        .isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    NoteController.deleteNote
)

export default router

