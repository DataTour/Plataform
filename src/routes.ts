import { Router } from 'express'

import UsersController from '@controllers/UsersController'

import AuthController from '@controllers/AuthController'

const routes = Router()

routes.get('/', UsersController.index)

routes.post('/auth/register', AuthController.register)
routes.post('/auth/authenticate', AuthController.authenticate)
routes.post('/auth/forgot_password', AuthController.forgotPassword)
routes.post('/auth/reset_passord', AuthController.resetpassword)

export default routes