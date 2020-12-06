import { Request, Response } from 'express'

class UsersController {
  public async index(req: Request, res: Response): Promise<Response> {
    
    return res.json({ message: 'olá mundo' })
  }


}

export default new UsersController()
