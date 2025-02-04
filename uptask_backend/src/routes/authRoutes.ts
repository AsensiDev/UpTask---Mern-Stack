import { Router } from 'express'
import { body, param } from 'express-validator'
import { AuthController } from '../@controllers/AuthController'
import { handleInputErrors } from '../middleware/validation'

const router = Router()

router.post('/register', 
    body('name')
        .notEmpty().withMessage('El nombre no puede ir vacío'),
    body('password')
        .isLength({min: 8}).withMessage('La contraseña debe tener al menos 8 caracteres'),
    body('password_confirmation')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Las contraseñas no coinciden')
            }
            return true
        }),
    body('email')
        .isEmail().withMessage('Email no válido'),
    handleInputErrors,
    AuthController.createAccount
)

router.post('/confirm-account', 
    body('token')
        .notEmpty().withMessage('El token no puede ir vacío'),
    handleInputErrors,
    AuthController.confirmAccount
)

router.post('/login', 
    body('email')
        .isEmail().withMessage('Email no válido'),
    body('password')
        .notEmpty().withMessage('La contraseña no puede ir vacía'),
    handleInputErrors,
    AuthController.login
)

router.post('/request-code', 
    body('email')
        .isEmail().withMessage('Email no válido'),
    handleInputErrors,
    AuthController.requestConfirmationCode
)
router.post('/forgot-password', 
    body('email')
        .isEmail().withMessage('Email no válido'),
    handleInputErrors,
    AuthController.forgotPassword
)

router.post('/validate-token',
    body('token')
        .notEmpty().withMessage('El token no puede ir vacío'),
    handleInputErrors,
    AuthController.validateToken
)

router.post('/update-password/:token',
    param('token')
        .isNumeric().withMessage('Token no válido'),
    body('password')
        .isLength({min: 8}).withMessage('La contraseña debe tener al menos 8 caracteres'),
    body('password_confirmation')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Las contraseñas no coinciden')
            }
            return true
        }),
    handleInputErrors,
    AuthController.updatePasswordWithToken
)

export default router