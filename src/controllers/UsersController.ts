import { Request, Response } from 'express'

class UsersController {
  public async index(req: Request, res: Response): Promise<Response> {
    
    return res.json({ message: 'olá mundo' })
  }

  public async score(req: Request, res: Response): Promise<Response> {
    const id = req.params.userId

    return res.json({ 
      userId: id,
      cnpj: 	13568985000106,
      score: 8.7 
    })
  }
}

export default new UsersController()
