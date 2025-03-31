import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    status: { type: String, enum: ['pending', 'resolved', 'closed'], default: 'pending' },
    reportingUser: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        refPath: 'reportingUserType' 
    },
    reportingUserType: { 
        type: String, 
        required: true, 
        enum: ['User', 'Transporter'] 
    },
    reportedUser: { 
        type: mongoose.Schema.Types.ObjectId, 
        refPath: 'reportedUserType' 
    },
    reportedUserType: { 
        type: String, 
        enum: ['User', 'Transporter'] 
    },
    reportedShipment: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Shipment' 
    },
    solutionExplanation: { type: String }
}, { timestamps: true });

export default mongoose.model('Report', reportSchema);
