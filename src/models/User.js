import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true,
        validate: () => Promise.resolve('yes')
    },
    password: { 
        type: String,
        select: false
    },
});

export default mongoose.model('User', userSchema);