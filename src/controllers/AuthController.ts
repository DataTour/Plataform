import bcryt from 'bcrypt'

import jwt from 'jsonwebtoken'

import crypto from 'crypto'

import mailer from '@modules/mailer'

import authConfig from '@config/auth.json'

import { Request, Response } from 'express'

import User from  '@models/User'

function generateToken(params = {}) {
    return jwt.sign(params , authConfig.secret, {
        expiresIn: 86400
    })
}

class AuthController {
    public async register(req: Request, res: Response): Promise<Response> {
        const { email, username } = req.body

        try {
            
            if (await User.findOne({ email }))
                return res.status(400).json({ error: 'User already exits' })
            
            if (await User.findOne({ username }))
                return res.status(400).json({ error: 'User already exists' })

            const user = await User.create(req.body)
            
            user.password = undefined

            return res.status(200).json({ user, token: generateToken({ id: user.id })})

        } catch (err) {

            return res.status(400).json({ error: 'Registration failed ' + err })
        } 
    }

    public async authenticate(req: Request, res: Response): Promise<Response> {
        const { email, password } = req.body

        try {

            const user = await User.findOne({ email }).select('+password')

            if (!user)
                return res.status(400).json({ error: 'User not found' })
            
            if (!await bcryt.compare(password, user.password))
                return res.status(400).json({ error: ' Invalid password'})
    
            user.password = undefined
    
            return res.status(200).json({ user, token: generateToken({ id: user.id }) })

        } catch (err) {

            return res.status(400).json({ error: 'login failed ' + err })
        }

    }

    public async forgotPassword(req: Request, res: Response): Promise<Response> {
        const { email } = req.body 

        try {

            const user = await User.findOne( email ).exec()

            if (!user)
                return res.status(400).json({ erro: 'user not exists' })

            const token = crypto.randomBytes(20).toString('hex')

            const now = new Date()
            now.setHours(now.getHours() + 1)

            await User.findByIdAndUpdate(user.id, {
                '$seit': {
                    passwordResetToken: token,
                    passwordResetExires: now
                }
            }, {new: true, useFindAndModify: false })

            mailer.sendMail({
                to: email,
                subject: 'Request password 🔐',
                from: 'sie@gfrancodev.tech',
                template: 'auth/forgot_password',
                context: { token },
            }, (err) => {
                if (err) 
                    return res.status(400).json({ erro: 'Cannot send forgot password, try again' })

                return res.status(200).json({ success: 'Send token in your e-mail'})    
            })
            
        } catch (err) {

            return res.status(400).json({ erro: 'Erro on forgot password, try again' });    
        }
    }

    public async resetpassword(req: Request, res: Response): Promise<Response> {
        const { email, token, password } = req.body

        try {

            const user = await User.findOne({ email }).select('+passworResetTken passwordResetExires')

            if (!user)
                return res.status(400).json({ error: 'User not found' })

            if (token !== user.passwordResetToken)
                return res.status(400).json({ error: 'Token invalid' })    

            const now = new Date()

            if (now > user.passwordResetExpires)
                return res.status(400).json({ error: 'Token invalid' })

            user.password = password

            await user.save()

            res.status(200).json({ success: 'reset password with success' })
        } catch (err) {

            res.status(400).json({ error: 'Cannot reset password, try again'})
        }
    }
}

export default new AuthController