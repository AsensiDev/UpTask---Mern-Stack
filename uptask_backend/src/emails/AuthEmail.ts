import { transporter } from "../config/nodemailer"

interface IEmail {
    email: string
    name: string
    token: string
}

export class AuthEmail {
    static sendConfirmationEmail = async ( user : IEmail ) => {
        const info = await transporter.sendMail({
            from: 'UpTask <admin@uptask.com>',
            to: user.email,
            subject: 'Confirma tu cuenta',
            text: 'Confirma tu cuenta',
            html: `<p>Hola: ${user.name}, has creado tu cuenta en Uptask, ya casi está todo listo, solo debes confirmar tu cuenta</p>
            <p>Para confirmar tu cuenta, haz click en el siguiente enlace:</p>
            <a href='${process.env.FRONTEND_URL}/auth/confirm-account'>Confirmar cuenta</a>
            <p>E ingresa el código: <b>${user.token}</b></p>
            <p>Este token expira en 10 minutos</p>            
            
            
            `
        })

        console.log('mensaje enviado', info.messageId)
    }
}