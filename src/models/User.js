import mongoose from "mongoose";
import bcrypt from 'bcrypt';

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

userSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('password')) {
       user.password = await bcrypt.hash(user.password, 8); 
    }
    next()
})
export default mongoose.model('User', userSchema);