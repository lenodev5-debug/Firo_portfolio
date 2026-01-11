const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');

const deleteFile = async (filePath) => {
    try {
        if (filePath && fsSync.existsSync(filePath)) {
            await fs.unlink(filePath);
            console.log(`✅ File deleted: ${filePath}`);
            return true;
        }
        return false;
    } catch (error) {
        console.error('❌ Error deleting file:', error);
        return false;
    }
};

const deleteMultipleFiles = async (filePaths) => {
    try {
        const deletePromises = filePaths
            .filter(filePath => filePath && fsSync.existsSync(filePath))
            .map(filePath => fs.unlink(filePath));
        
        await Promise.all(deletePromises);
        console.log(`✅ Deleted ${deletePromises.length} files`);
        return true;
    } catch (error) {
        console.error('❌ Error deleting files:', error);
        return false;
    }
};

const cleanupOldFiles = async (folder, daysOld = 30) => {
    try {
        const directory = path.join(__dirname, '..', 'uploads', folder);
        if (!fsSync.existsSync(directory)) return;
        
        const files = await fs.readdir(directory);
        const cutoffDate = Date.now() - (daysOld * 24 * 60 * 60 * 1000);
        
        for (const file of files) {
            const filePath = path.join(directory, file);
            const stats = await fs.stat(filePath);
            
            if (stats.mtimeMs < cutoffDate) {
                await fs.unlink(filePath);
                console.log(`🧹 Cleaned up old file: ${filePath}`);
            }
        }
    } catch (error) {
        console.error('Error cleaning up files:', error);
    }
};

module.exports = {
    deleteFile,
    deleteMultipleFiles,
    cleanupOldFiles
};