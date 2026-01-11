const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type:String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    project_Type: {
        type: String,
        enum: ["Web Design", "Mobile App", "Graphic Design", "Fimga Design"],
        required: true
    },
    budget: {
        type: String,
        required: true
    },
    timeline:{
        type: String,
        required: true
    },
    fileImage: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model("userdata", userSchema);