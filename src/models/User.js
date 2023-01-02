import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
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
        // select: true
    },
});

userSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('password')) {
       user.password = await bcrypt.hash(user.password, 8); 
    }
    next()
});

userSchema.methods.credentials = async function(cb) {
    const user = await mongoose.model('User').findOne({email: this.email}, cb)
    if (!user) {
        throw new Error('incorrect email or password')
    }

    const isValid = await bcrypt.compare(this.password, user.password)
    if (!isValid) {
        throw new Error('incorrect email or password')
    }

    const token = jwt.sign({_id: user._id}, 'H8gsf6#$#3$ytgsvYTYMq0', { expiresIn: '1h' })
    return token
};

export default mongoose.model('User', userSchema);