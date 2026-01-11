const mongoose = require('mongoose');

const ProjectDisplaySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imagesUrls: { type: [String], required: true },
    technologiesUsed: { type: [String], required: true },
    liveDemoLink: { type: String },
});

module.exports = mongoose.model('ProjectDisplay', ProjectDisplaySchema);