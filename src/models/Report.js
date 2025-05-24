import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    status: { type: String, enum: ['pending', 'resolved', 'closed'], default: 'pending' },
    reportingUser: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: 'User'  // Siempre refiere al modelo User
    },
    reportingUserType: { 
        type: String, 
        required: true, 
        enum: ['User', 'Transporter']  // Solo para diferenciar el rol del usuario
    },
    reportedUser: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'  // Siempre refiere al modelo User 
    },
    reportedUserType: { 
        type: String, 
        enum: ['User', 'Transporter']  // Solo para diferenciar el rol del usuario
    },
    reportedShipment: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Shipment' 
    },
    solutionExplanation: { type: String }
}, { timestamps: true });

export default mongoose.model('Report', reportSchema);
