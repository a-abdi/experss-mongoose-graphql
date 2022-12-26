import mongoose ,{ Schema } from 'mongoose';

const bookSchema = new Schema({
    name: String,
    pages: Number,
    authorID: String
});

export default mongoose.model('Book', bookSchema);
