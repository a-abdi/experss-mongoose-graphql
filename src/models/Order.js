import mongoose from "mongoose";
const { Schema } = mongoose;
const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true,
    },
    goods: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true,
    },
    count: { 
        type: Number,
        required: true,
    },
},
{
    timestamps: true
});

export default mongoose.model('Order', orderSchema);