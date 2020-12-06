import express from 'express'

import cors from 'cors'

import mongoose from 'mongoose'

import routes from './routes'

import restrict from './restrict'

class App {
    public express: express.Application

    constructor () {
        this.express = express()

        this.middlewares()
        this.database()
        this.routes()
    }

    private middlewares (): void {
        this.express.use(express.json())
        this.express.use(cors())
        this.express.use(restrict)
    }   

    private database (): void {
        mongoose.connect('mongodb+srv://datatour:hackatontour@cluster0.rsnam.mongodb.net/datatour?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
    }

    private routes (): void {
        this.express.use(routes)
    }
          
}

export default new App().express
