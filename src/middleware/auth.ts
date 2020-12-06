import { NextFunction, Request, Response} from 'express'

import jwt from 'jsonwebtoken'

import authConfig from '@config/auth.json'

class Middleware {
    public async auth(req:Request, res:Response, next:NextFunction): Promise<any> {
        const authHeader = req.headers.authorization

        if (!authHeader)
            return res.status(401).json({ error: 'No token provided' })

        const parts = authHeader.split(' ')

        if (parts.length != 2)
            return res.status(401).json({ error: 'Token error' })

        const [ scheme, token ] = parts

        if (!/Bearer$/i.test(scheme))
            return res.status(401).json({ error: 'Token badformated' })
        
        jwt.verify(token, authConfig.secret, (err:string, decoded:any) => {
            if(err) return res.status(401).json({ error: 'Token invalid' })
        
            req.params.userId = decoded.id 

            return next()
        })
    }
}

export default new Middleware()