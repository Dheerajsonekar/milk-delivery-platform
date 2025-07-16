import mongoose from 'mongoose'

const deliveryBoySchema = new mongoose.Schema({
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true},
    phone: { type: String, required: true, unique: true},
    isAvailable: { type: Boolean, default: true},
    assignedOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order'}],

    
}, {timestamps: true})

export default mongoose.model('DeliveryBoy', deliveryBoySchema) 