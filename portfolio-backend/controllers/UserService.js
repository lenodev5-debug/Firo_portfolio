const UserService = require('../models/UserService');
exports.createUserService = async (req, res) => {
    try {
        const serviceData = { 
            ...req.body, 
            userId: req.user.id
        };
        
        // Handle image upload
        if (req.file) {
            serviceData.image = req.file.path;
        } else {
            return res.status(400).json({
                success: false,
                message: 'Service image is required'
            });
        }
        
        const newService = new UserService(serviceData);
        await newService.save();
        
        res.status(201).json({ 
            success: true,
            message: "Service created successfully",
            data: newService
        });        
    } catch (error) {
        if (req.file) await deleteFile(req.file.path);
        
        console.error(error);
        res.status(500).json({ 
            success: false,
            message: 'Server Error' 
        });
    }
};

exports.updateUserService = async (req, res) => {
    try {
        const { id } = req.params;
        const findService = await UserService.findById(id);
        
        if (!findService) {
            if (req.file) await deleteFile(req.file.path);
            return res.status(404).json({ 
                success: false,
                message: "Service not found" 
            });
        }

        if (findService.userId.toString() !== req.user.id) {
            if (req.file) await deleteFile(req.file.path);
            return res.status(403).json({
                success: false,
                message: "Not authorized to update this service"
            });
        }

        const updateData = { ...req.body };
        
        if (req.file) {
            if (findService.image) {
                await deleteFile(findService.image);
            }
            updateData.image = req.file.path;
        }

        const updatedService = await UserService.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true }
        );
        
        res.status(200).json({
            success: true,
            message: "Service updated successfully",
            data: updatedService
        });

    } catch (error) {
        if (req.file) await deleteFile(req.file.path);
        console.error(error);
        res.status(500).json({ 
            success: false,
            message: 'Server Error' 
        });
    }           
};

exports.getUserServices = async (req, res) => {
    try {
        const services = await UserService.find();
        
        res.status(200).json({ 
            success: true,
            message: "Services fetched successfully",
            data: services
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            message: 'Server Error' 
        });
    }
};

exports.getUserServiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await UserService.findById(id);
        
        if (!service) {
            return res.status(404).json({ 
                success: false,
                message: "Service not found" 
            });
        }
        
        res.status(200).json({ 
            success: true,
            message: "Service fetched successfully",
            data: service
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            message: 'Server Error' 
        });
    }
};

exports.deleteUserService = async (req, res) => {
    try {
        const { id } = req.params;
        const findService = await UserService.findById(id);

        if (!findService) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        if (findService.userId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this service"
            });
        }

        const deleteService = await UserService.findByIdAndDelete(id);
        
        res.status(200).json({ 
            success: true,
            message: "Service deleted successfully",
            data: deleteService
        });
    } catch(error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            message: 'Server Error' 
        });
    }   
}

exports.getMyServices = async (req, res) => {
    try {
        const services = await UserService.find({ userId: req.user.id });
        
        res.status(200).json({ 
            success: true,
            message: "Your services fetched successfully",
            data: services
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            message: 'Server Error' 
        });
    }
};