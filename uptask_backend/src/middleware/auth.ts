import { Request, Response, NextFunction } from "express"
import jwt from 'jsonwebtoken'
import User, { IUser } from "../@models/User"

// add user to Request type
declare global {
    namespace Express {
        interface Request {
            user?: IUser
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization

    if(!bearer) {
        const error = new Error('No Autorizado')
        res.status(401).json({error: error.message})
        return
    }

    const token = bearer.split(' ')[1]
    
    try {
        // check if token exists
        const decoded = jwt.verify(token, process.env.JWT_SECRET) 

        // check user exists
        if(typeof decoded === 'object' && decoded.id) {
            const user = await User.findById(decoded.id).select('_id name email')
            if(user) {
                req.user = user
            } else {
                res.status(500).json({error: 'Token no Válido'})
            }
        }
        
    } catch (error) {
        res.status(500).json({error: 'Token no Válido'})
    }

    next()
}