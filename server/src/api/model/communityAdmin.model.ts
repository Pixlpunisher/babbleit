import { Schema, model } from 'mongoose'

import { CommunityAdminDocument } from '../../types'

const roleSchema = new Schema({
  communityId: {
    type: Schema.Types.ObjectId,
    ref: 'community',
    required: [true, 'Community id must be provided']
  },
  role: {
    type: String,
    enum: ['admin', 'moderator'],
    required: [true, 'Role must be provided']
  }
})

const communityAdminSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'User id must be provided']
  },
  user_name: {
    type: String,
    required: [true, 'Username must be provided']
  },
  roles: {
    type: [roleSchema]
  }
})

const CommunityAdminModel = model<CommunityAdminDocument>(
  'communityAdmin',
  communityAdminSchema
)

export default CommunityAdminModel
