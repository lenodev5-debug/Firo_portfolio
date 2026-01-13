const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        trim: true
    },
    project_Type: {
        type: String,
        required: [true, "Project type is required"],
        enum: ["Web Design", "Mobile App", "Graphic Design", "Figma Design", "Branding"]
    },
    budget: {
        type: String,
        required: [true, "Budget is required"]
    },
    timeline: {
        type: String,
        required: [true, "Timeline is required"]
    },
    fileImage: {
        type: String,
        default: ""
    },
    fileImages: [{
        type: String
    }],
    message: {
        type: String,
        required: [true, "Message is required"],
        trim: true,
        minlength: [10, "Message should be at least 10 characters long"]
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model("ContactMessage", userSchema);