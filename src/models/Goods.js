import mongoose from "mongoose";

const goodsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true,
    },
    price: {
        type: Number,
        required: true,
    },
    count: { 
        type: Number,
    },
},
{
    timestamps: true
});

export default mongoose.model('Goods', goodsSchema);