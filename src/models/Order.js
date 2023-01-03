import mongoose from "mongoose";
const { Schema } = mongoose;
const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true,
        ref: 'User'
    },
    goods: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true,
        ref: 'Goods'
    },
    count: { 
        type: Number,
        required: true,
    },
},
{
    timestamps: true
});

orderSchema.post('save', function(order, next) {
    order.populate('user goods').then(function() {
      next();
    });
});

export default mongoose.model('Order', orderSchema);