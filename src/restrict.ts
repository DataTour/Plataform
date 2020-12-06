import { Router } from 'express' 

import UsersController from '@controllers/UsersController'

import Middleware from '@middleware/auth'

const restrict = Router()

restrict.get('/app', Middleware.auth, UsersController.index)


restrict.post('/')

export default restrict