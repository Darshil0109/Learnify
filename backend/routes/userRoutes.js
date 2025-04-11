const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getUserData,editUserData, getUserSkills } = require("../controllers/userController");
const router = express.Router();
const multer = require('multer');
const { storage } = require("../utils/cloudinary");

const upload = multer({ storage });

router.get('/',authMiddleware,getUserData);
router.post('/editProfile',authMiddleware,upload.single('profile_image'),editUserData);
router.get('/skills',authMiddleware,getUserSkills);


module.exports = router;


