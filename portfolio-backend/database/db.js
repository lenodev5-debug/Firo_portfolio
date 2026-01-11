const mongoose = require('mongoose');
const mongodb_URL = process.env.mongodb_URL;

mongoose.connect(mongodb_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');        
}).catch((error) => {
    console.error('Error connecting to MongoDB', error.message);
    process.exit(1);
});

module.exports = mongoose;