import mongoose ,{ Schema } from 'mongoose';

const authorSchema = new Schema({
   name: String,
   age: Number
},
// {collection: 'Author'}
);

export default mongoose.model('Author', authorSchema);