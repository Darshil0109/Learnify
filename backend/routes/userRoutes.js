const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getUserData,editUserData, getUserSkills, editUserImage, deleteUser, getUserById } = require("../controllers/userController");
const router = express.Router();
const multer = require('multer');
const { storage } = require("../utils/cloudinary");

const upload = multer({ storage });

router.get('/',authMiddleware,getUserData);
router.post('/editProfile',authMiddleware,editUserData);
router.post('/editProfileImage',authMiddleware,upload.single('profile_image'),editUserImage);
router.get('/skills',authMiddleware,getUserSkills);
router.delete('/deleteAccount',authMiddleware,deleteUser);
router.get('/user/:user_id',getUserById);

module.exports = router;


