import mongoose from 'mongoose';

const shipmentSchema = new mongoose.Schema({
  imageUrl: { type: String, required: false },
  pickupAddress: { type: String, required: true },
  deliveryAddress: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: false },
  weight: { type: Number, required: true },
  dimensions: {
    height: { type: Number, required: true },
    width: { type: Number, required: true },
    length: { type: Number, required: true },
  },
  pickupTime: { type: Date, required: false },
  cost: { type: Number, required: true },
  status: { 
    type: String,
    enum: ['pending', 'activated', 'accepted', 'in_transit', 'delivered', 'cancelled'],
    default: 'pending',
  },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  transporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

export default mongoose.model('Shipment', shipmentSchema);