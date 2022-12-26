import mongoose from 'mongoose';

export default () => {
    try {
        mongoose.connect('mongodb://127.0.0.1:27017/graphExperss')
        mongoose.set("strictQuery", false);
        mongoose.connection.once('open', () => {
           console.log('connected to database');
        });
    } catch (error) {
        console.log(`error connected to database${error}`);
    }
}