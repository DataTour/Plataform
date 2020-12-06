import { Schema, model } from 'mongoose'

import bcrypt from 'bcrypt'

import { DateTime } from 'luxon'

import UserInterface from '@interface/UserInterface'

import { NextFunction } from 'express'

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  charge: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    select: false
  },
  createAt: {
    type: Date,
    default: DateTime.local().setZone('America/Sao_Paulo')
  },
  updateAt: {
    type: Date,
    default: DateTime.local().setZone('America/Sao_Paulo')
  }
})

userSchema.pre('save', async function(next: NextFunction): Promise<void> {
  const hash = await bcrypt.hash(userSchema.password, 10)
  userSchema.password = hash

  next()
})

export default model<UserInterface>('user', userSchema)