import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  type: {type: String, enum: ['car', 'truck', 'pick-up', '4x4', 'van', 'motorcycle'], default: 'car' },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  plate: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Referencia al usuario
});

export default mongoose.model('Vehicle', vehicleSchema);