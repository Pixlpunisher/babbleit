import { Schema, model } from 'mongoose'

import { AdminDocument } from '../../types'

const adminSchema = new Schema({
  Id: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'User id must be provided'],
    unique: true
  }
})

const AdminModel = model<AdminDocument>('admin', adminSchema)

export default AdminModel
