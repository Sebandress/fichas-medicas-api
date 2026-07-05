import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
export default User;
