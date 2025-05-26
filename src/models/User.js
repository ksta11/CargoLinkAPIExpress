import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: false , default: 'none'},
  role: { type: String, enum: ['user', 'admin', 'transporter'], default: 'user' }, // Roles disponibles: 'user', 'admin' y 'transporter'
  password: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('User', UserSchema);