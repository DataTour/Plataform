import path from 'path'

import nodemailer from 'nodemailer'

import hbs from 'nodemailer-express-handlebars'

import { host, port, secure, user, pass  } from '@config/mail.json'

const transport = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass}
})

transport.use('compile', hbs({
    viewEngine: {
        defaultLayout: undefined,
        partialsDir: path.resolve('./resources/mail/')
    },
    viewPath: path.resolve('./resources/mail/'),
    extName: '.html'
}))

export default transport