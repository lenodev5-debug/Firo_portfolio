const UserService = require('../models/UserService');
const { deleteFile } = require('../middleware/cleanup');

exports.createUserService = async (req, res) => {
    try {
        const { name, serviceType, description, price, technologies, imageDescriptions } = req.body;
        
        if (!name || !serviceType || !description || !price) {
            // Clean up uploaded files if validation fails
            if (req.files) {
                await Promise.all(req.files.map(file => deleteFile(file.path)));
            }
            if (req.file) await deleteFile(req.file.path);
            
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields: name, serviceType, description, price'
            });
        }

        const serviceData = { 
            name,
            serviceType,
            description,
            price: parseFloat(price),
            userId: req.user.id  
        };
        
        // Handle technologies
        if (technologies) {
            serviceData.technologies = Array.isArray(technologies) 
                ? technologies 
                : technologies.split(',').map(tech => tech.trim());
        }
        
        // Handle main image
        if (req.file) {
            serviceData.mainImage = `/uploads/${req.file.filename}`;
        } else {
            serviceData.mainImage = '/uploads/default-service.png';
        }
        
        // Handle multiple images with descriptions
        if (req.files && req.files.length > 0) {
            let descriptions = [];
            
            try {
                // Parse imageDescriptions if provided
                if (imageDescriptions) {
                    descriptions = Array.isArray(imageDescriptions) 
                        ? imageDescriptions 
                        : JSON.parse(imageDescriptions);
                }
            } catch (error) {
                console.warn('Error parsing image descriptions:', error);
            }
            
            // Map files to image objects with descriptions
            serviceData.images = req.files.map((file, index) => ({
                url: `/uploads/${file.filename}`,
                description: descriptions[index] || '',
                altText: descriptions[index] || file.originalname,
                order: index,
                isFeatured: index === 0 // First image is featured by default
            }));
        } else {
            // If no multiple images, create from main image
            serviceData.images = [{
                url: serviceData.mainImage,
                description: description,
                altText: name,
                order: 0,
                isFeatured: true
            }];
        }
        
        const newService = new UserService(serviceData);
        await newService.save();
        
        res.status(201).json({ 
            success: true,
            message: "Service created successfully",
            data: newService
        });        
    } catch (error) {
        // Clean up uploaded files on error
        if (req.files) {
            await Promise.all(req.files.map(file => deleteFile(file.path)));
        }
        if (req.file) await deleteFile(req.file.path);
        
        console.error('Create service error:', error);
        
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }
        
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Service with this name already exists'
            });
        }
        
        res.status(500).json({ 
            success: false,
            message: 'Server error creating service'
        });
    }
};

exports.updateUserService = async (req, res) => {
    try {
        const { id } = req.params;
        
        const findService = await UserService.findById(id);
        
        if (!findService) {
            if (req.files) await Promise.all(req.files.map(file => deleteFile(file.path)));
            if (req.file) await deleteFile(req.file.path);
            return res.status(404).json({ 
                success: false,
                message: "Service not found" 
            });
        }

        if (findService.userId.toString() !== req.user.id) {
            if (req.files) await Promise.all(req.files.map(file => deleteFile(file.path)));
            if (req.file) await deleteFile(req.file.path);
            return res.status(403).json({
                success: false,
                message: "Not authorized to update this service"
            });
        }

        const updateData = {};
        
        if (req.body.name) updateData.name = req.body.name;
        if (req.body.serviceType) updateData.serviceType = req.body.serviceType;
        if (req.body.description) updateData.description = req.body.description;
        if (req.body.price) updateData.price = parseFloat(req.body.price);
        
        if (req.body.technologies) {
            updateData.technologies = Array.isArray(req.body.technologies) 
                ? req.body.technologies 
                : req.body.technologies.split(',').map(tech => tech.trim());
        }
        
        // Handle main image update
        if (req.file) {
            if (findService.mainImage && findService.mainImage !== '/uploads/default-service.png') {
                await deleteFile(findService.mainImage);
            }
            updateData.mainImage = `/uploads/${req.file.filename}`;
        }
        
        // Handle multiple images update
        if (req.files && req.files.length > 0) {
            let descriptions = [];
            
            try {
                if (req.body.imageDescriptions) {
                    descriptions = Array.isArray(req.body.imageDescriptions) 
                        ? req.body.imageDescriptions 
                        : JSON.parse(req.body.imageDescriptions);
                }
            } catch (error) {
                console.warn('Error parsing image descriptions:', error);
            }
            
            // Delete old images
            if (findService.images && findService.images.length > 0) {
                await Promise.all(
                    findService.images
                        .filter(img => img.url !== '/uploads/default-service.png')
                        .map(img => deleteFile(img.url))
                );
            }
            
            // Create new image objects
            updateData.images = req.files.map((file, index) => ({
                url: `/uploads/${file.filename}`,
                description: descriptions[index] || '',
                altText: descriptions[index] || file.originalname,
                order: index,
                isFeatured: index === 0
            }));
        } else if (req.body.images && req.body.images.length > 0) {
            // If updating image metadata without uploading new files
            try {
                const imagesData = JSON.parse(req.body.images);
                updateData.images = imagesData;
            } catch (error) {
                console.warn('Error parsing images metadata:', error);
            }
        }
        
        const updatedService = await UserService.findByIdAndUpdate(
            id, 
            updateData, 
            { 
                new: true, 
                runValidators: true 
            }
        );
        
        res.status(200).json({
            success: true,
            message: "Service updated successfully",
            data: updatedService
        });

    } catch (error) {
        if (req.files) await Promise.all(req.files.map(file => deleteFile(file.path)));
        if (req.file) await deleteFile(req.file.path);
        
        console.error('Update service error:', error);
        
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }
        
        res.status(500).json({ 
            success: false,
            message: 'Server error updating service'
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

        // Delete main image
        if (findService.mainImage && findService.mainImage !== '/uploads/default-service.png') {
            await deleteFile(findService.mainImage);
        }
        
        // Delete all additional images
        if (findService.images && findService.images.length > 0) {
            await Promise.all(
                findService.images
                    .filter(img => img.url !== '/uploads/default-service.png')
                    .map(img => deleteFile(img.url))
            );
        }

        await UserService.findByIdAndDelete(id);
        
        res.status(200).json({ 
            success: true,
            message: "Service deleted successfully",
            data: { id }
        });
    } catch(error) {
        console.error('Delete service error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error deleting service'
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

exports.countProject = async (req, res) => {
    try {
       const counts =  await UserService.aggregate([
        {$group: {_id: $service.aggregate, count: {$sum:1}}}
       ]);

       res.json({ success: true, data: counts});
    } catch (error) {
        res.status(500).json({success: false, message: "Server Error"})
    }
}