const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
const multer = require('multer');
const { mixedStorage } = require("../utils/cloudinary");
const { addCourseData, getCourseById, getLessonsAndModulesByCourseId, getAllCourses, enrollCourse, getEnrolledCourses, getCourseProgress, getEnrollmentStatus, getCourseThumbnail, getCompletedLessons, addCompletedLesson } = require("../controllers/courseController");

const upload = multer({ storage: mixedStorage });
// Multer middleware
const uploadFields = [{ name: 'thumbnail', maxCount: 1 }];
for (let i = 0; i < 20; i++) {
  uploadFields.push({ name: `lessonVideo_${i}`, maxCount: 1 });
}

router.get('/',getAllCourses);
router.post('/addCourse',authMiddleware , upload.fields(uploadFields) , async (req, res) => {
    try {
      const thumbnailUrl = req.files?.thumbnail?.[0]?.path;
      // Collect videos in order: lessonVideo_0, lessonVideo_1, ...
      const lessonVideos = Object.entries(req.files || {})
      .filter(([key]) => key.startsWith('lessonVideo_'))
      .map(([key, fileArr]) => ({
        index: parseInt(key.split('_')[1], 10),
        url: fileArr[0]?.path
      }))
      .sort((a, b) => a.index - b.index);

      // Forward all data to controller
      await addCourseData(req, res, {
        thumbnailUrl,
        lessonVideos
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Upload or processing failed' });
    }
});
router.get('/enrolledCourses',authMiddleware, getEnrolledCourses);
router.get('/course/progress',authMiddleware, getCourseProgress);
router.get('/course/completed-lessons',authMiddleware,getCompletedLessons);
router.post('/course/complete/lesson/:lessonId',authMiddleware,addCompletedLesson);
router.post('/enroll/:courseId',authMiddleware,enrollCourse);
router.get('/course/:courseId', getCourseById);
router.get('/course/lessons/:courseId', getLessonsAndModulesByCourseId);
router.get('/course/check-enrollment/:courseId',authMiddleware,getEnrollmentStatus);
router.get('/course/thumbnail/:courseId',getCourseThumbnail);
module.exports = router;