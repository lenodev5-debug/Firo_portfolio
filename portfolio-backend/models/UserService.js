const mongoose = require('mongoose');

const UserServiceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    serviceType: { type: String, enum: ['web', 'mobile', 'design'], required: true },
    technologies: { type: [String], required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true 
    }
},
 { timestamps: true }
);

module.exports = mongoose.model('UserService', UserServiceSchema);