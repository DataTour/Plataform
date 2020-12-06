import { Document } from 'mongoose'

interface UserInterface extends Document {
    name: String
    lastname: String
    username: String
    email: String
    charge: String
    password: String
    passwordResetToken: String
    passwordResetExpires: Date
    createAt: Date
    updateAt: Date
}

export default UserInterface