import mongoose from "mongoose";

const goodsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true,
        validate: () => Promise.resolve('yes')
    },
    count: { 
        type: String,
        // select: true
    },
},
{
    timestamps: true
});

export default mongoose.model('Goods', goodsSchema);