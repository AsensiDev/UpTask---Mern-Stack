import type { Request, Response } from 'express'
import { checkPassword, hashPassword } from '../utils/auth'
import User from '../@models/User'
import Token from '../@models/Token'
import { generateToken } from '../utils/token'
import { AuthEmail } from '../emails/AuthEmail'

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

            // generate token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            // send email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await Promise.allSettled([user.save(), token.save()])
            res.send('Cuenta creada, revisa tu email para confirmarla')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static confirmAccount = async (req : Request, res : Response) => {
        try {
            // check if token exists
            const { token } = req.body
            const tokenExists = await Token.findOne({token})
            
            if(!tokenExists) {
                const error = new Error('El token no es válido')
                res.status(404).json({error: error.message})
            }

            // activate user
            const user = await User.findById(tokenExists.user)
            user.confirmed = true

            await Promise.allSettled([
                user.save(), 
                tokenExists.deleteOne()
            ])

            res.send('Cuenta confirmada correctamente')

        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static login = async (req : Request, res : Response) => {
        try {
            // check if user exists
            const { email, password } = req.body
            const user = await User.findOne({email})
            if (!user) {
                const error = new Error('Usuario no encontrado')
                res.status(404).json({error: error.message})
            }
            // check is user is confirmed
            if (!user.confirmed) {
                // generate new token
                const token = new Token()
                token.user = user.id
                token.token = generateToken()
                await token.save()

                // send email
                AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                })

                const error = new Error('Usuario no confirmado, hemos enviado un e-mail de confirmación')
                res.status(401).json({error: error.message})
            }

            // check password
            const isPasswordCorrect = await checkPassword(password, user.password)
            if (!isPasswordCorrect) {
                const error = new Error('Contraseña incorrecta')
                res.status(401).json({error: error.message})
            }

            // if everything is correct
            res.send('Usuario logueado correctamente')

        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static requestConfirmationCode = async (req : Request, res : Response) => {
        try {
            
            const { email } = req.body

            // check if user exists
            const user = await User.findOne({email})
            if (!user) {
                const error = new Error('El usuario no está registrado')
                res.status(404).json({error: error.message})
            }

            // check if user is confirmed
            if(user.confirmed) {
                const error = new Error('El usuario ya está confirmado')
                res.status(403).json({error: error.message})
            }

            // generate token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            // send email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await Promise.allSettled([user.save(), token.save()])
            res.send('Se ha enviado un nuevo token')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

}