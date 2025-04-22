const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'profile_images', // optional: folder name in Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg'], // file types allowed
    },
});
const mixedStorage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
      if (file.fieldname === 'thumbnail') {
        return {
          folder: 'courses/thumbnails',
          resource_type: 'image',
          allowed_formats: ['jpg', 'png', 'jpeg']
        };
      } else if (file.fieldname.startsWith('lessonVideo_')) {
        return {
          folder: 'courses/videos',
          resource_type: 'video',
          allowed_formats: ['mp4', 'webm', 'mov']
        };
      }
      return {};
    }
  });
  
module.exports = { cloudinary, storage , mixedStorage };