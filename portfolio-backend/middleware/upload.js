const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

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
        
        if (req.baseUrl.includes('achievements')) {
            folder = 'achievements';
        } else if (req.baseUrl.includes('services')) {
            folder = 'services';
        } else if (req.baseUrl.includes('projects')) {
            folder = 'projects';
        } else if (req.baseUrl.includes('owner')) {
            folder = 'profiles';
        }
        
        const uploadDir = createUploadsDir(folder);
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueName = uuidv4();
        const extension = path.extname(file.originalname).toLowerCase();
        cb(null, `${uniqueName}${extension}`);
    }
});

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

const uploadImage = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, 
        files: 1 
    },
    fileFilter: imageFilter
});

const uploadMultipleImages = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, 
        files: 5 
    },
    fileFilter: imageFilter
});

const uploadAnyFile = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, 
        files: 1
    },
    fileFilter: allFilesFilter
});
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File too large. Maximum size is 5MB for images, 10MB for other files'
            });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                message: 'Too many files. Maximum is 5 files'
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
    handleMulterError
};