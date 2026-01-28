const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Use dynamic import for uuid (ESM package)
let uuidGenerator;

// Initialize uuid generator
(async () => {
    try {
        const uuid = await import('uuid');
        uuidGenerator = uuid.v4;
    } catch (error) {
        console.error('Failed to load uuid, using fallback:', error.message);
        uuidGenerator = () => Date.now() + '-' + Math.round(Math.random() * 1E9);
    }
})();

// Helper function to generate unique filename
const generateUniqueId = () => {
    if (uuidGenerator) {
        return uuidGenerator();
    }
    // Fallback if uuid isn't loaded yet
    return Date.now() + '-' + Math.round(Math.random() * 1E9);
};

const createUploadsDir = (folder) => {
    const dir = `uploads/${folder}`;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    return dir;
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folder = 'general';
        
        // Determine folder based on request URL
        const baseUrl = req.baseUrl || '';
        if (baseUrl.includes('achievements')) {
            folder = 'achievements';
        } else if (baseUrl.includes('services')) {
            folder = 'services';
        } else if (baseUrl.includes('projects')) {
            folder = 'projects';
        } else if (baseUrl.includes('owner')) {
            folder = 'profiles';
        } else if (baseUrl.includes('contact')) {
            folder = 'contacts';
        }
        
        const uploadDir = createUploadsDir(folder);
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueName = generateUniqueId();
        const extension = path.extname(file.originalname).toLowerCase();
        cb(null, `${uniqueName}${extension}`);
    }
});

// File filters (same as before)
const imageFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp, svg)'), false);
    }
};

const contactFileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|pdf|fig|psd|ai|xd|doc|docx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files, PDFs, and design files are allowed'), false);
    }
};

const allFilesFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|svg|pdf|doc|docx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('File type not allowed. Allowed: images, PDFs, docs, txt'), false);
    }
};

// Multer configurations
const uploadImage = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 1 
    },
    fileFilter: imageFilter
});

const uploadMultipleImages = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 5 
    },
    fileFilter: imageFilter
});

const uploadAnyFile = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
        files: 1
    },
    fileFilter: allFilesFilter
});

const uploadContactFile = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
        files: 3
    },
    fileFilter: contactFileFilter
});

// Error handler
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File too large. Maximum size is 10MB for contact files'
            });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                message: 'Too many files. Maximum is 3 files'
            });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                success: false,
                message: 'Unexpected field name for file upload'
            });
        }
    } else if (err) {
        return res.status(400).json({
            success: false,
            message: err.message || 'Error uploading file'
        });
    }
    next();
};

module.exports = {
    uploadImage,
    uploadMultipleImages,
    uploadAnyFile,
    uploadContactFile,
    handleMulterError
};