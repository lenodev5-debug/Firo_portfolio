const ContactMessage = require('../models/user');

exports.UserMessage = async(req, res) => {
    try{
        // Get file paths if files were uploaded
        const filePaths = req.files ? req.files.map(file => file.path) : [];
        
        // Map frontend project type to model enum
        const projectTypeMap = {
            'web': 'Web Design',
            'mobile': 'Mobile App', 
            'branding': 'Branding',
            'graphic': 'Graphic Design'
        };
        
        // Create message object
        const messageData = {
            username: req.body.username || req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            project_Type: projectTypeMap[req.body.projectType] || req.body.project_Type || 'Web Design',
            budget: req.body.budget,
            timeline: req.body.timeline,
            message: req.body.message,
            fileImage: filePaths.length > 0 ? filePaths[0] : "",
            fileImages: filePaths
        };

        const newMessage = new ContactMessage(messageData);
        await newMessage.save();
        
        res.status(201).json({
            success: true,
            message: "Message sent successfully!",
            data: {
                id: newMessage._id,
                name: newMessage.username,
                email: newMessage.email,
                projectType: newMessage.project_Type,
                submittedAt: newMessage.createdAt
            }
        });
    } catch(error){
        console.error('Error saving message:', error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later.",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

exports.UpdateMessage = async(req, res) => {
    try{
        const { id } = req.params;
        const updatedMessage = await ContactMessage.findByIdAndUpdate(
            id, 
            req.body, 
            { new: true, runValidators: true }
        );
        
        if (!updatedMessage) {
            return res.status(404).json({
                success: false,
                message: "Message not found"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Message updated successfully",
            data: updatedMessage
        });
    } catch(error){
        console.error('Error updating message:', error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
}

exports.DeleteMessage = async(req, res) => {
    try{
        const { id } = req.params;
        const deletedMessage = await ContactMessage.findByIdAndDelete(id);
        
        if (!deletedMessage) {
            return res.status(404).json({
                success: false,
                message: "Message not found"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Message deleted successfully"
        });
    } catch(error){
        console.error('Error deleting message:', error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
}