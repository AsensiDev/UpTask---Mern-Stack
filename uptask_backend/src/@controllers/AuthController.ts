import type { Request, Response } from 'express'
import { hashPassword } from '../utils/auth'
import User from '../@models/User'

export class AuthController {

    static createAccount = async (req : Request, res : Response) => {
        try {
            
            const { password, email } = req.body

            // check if user exists
            const userExists = await User.findOne({email})
            if (userExists) {
                const error = new Error('El usuario ya está registrado')
                res.status(409).json({error: error.message})
            }

            // create an user
            const user = new User(req.body)

            // hash password
            user.password = await hashPassword(password)

            await user.save()
            res.send('Cuenta creada, revisa tu email para confirmarla')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

}