import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  type: {type: String, enum: ['transporter', 'user']},
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, trim: true, maxlength: 500 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  transporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Shipment', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Actualizar la fecha de actualización antes de guardar
reviewSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Review', reviewSchema);