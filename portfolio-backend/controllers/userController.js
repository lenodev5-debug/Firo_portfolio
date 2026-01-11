const userModules = require('../models/user');

exports.UserMessage = async(req, res) => {
    try{
        const newMessage = new userModules(req.body);
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch(error){
        console.log(error);
        res.status(500).json({message: "Server Error"});
    }
}

exports.UpdateMessage = async(req, res) => {
    try{
        const { id } = req.params;
        const updatedMessage = await userModules.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedMessage);
    } catch(error){
        
    }
}

exports.DelteMessage = async(req, res) => {
    try{
        const { id } = req.params;
        const deletedMessage = await userModules.findByIdAndDelete(id);
        res.status(200).json(deletedMessage, { message: "Message deleted successfully" });
    } catch(error){
        
    }
}