const pool = require("../config/db");


const normalizeModuleName = (name) => {
    return name.toLowerCase().trim().replace(/\s+/g, ' ');
};
const getOrCreateModuleId = async (courseId, rawModuleName) => {
    const normalized = normalizeModuleName(rawModuleName);

    // Check if module already exists
    const { rows } = await pool.query(
        `SELECT module_id FROM modules WHERE module_name = $1 AND course_id = $2`,
        [normalized, courseId]
    );

    if (rows.length > 0) {
        return rows[0].module_id;
    }

    // Insert new module
    const insert = await pool.query(
        `INSERT INTO modules (course_id, module_name) VALUES ($1, $2) RETURNING module_id`,
        [courseId, normalized]
    );

    return insert.rows[0].module_id;
};
const insertLesson = async (courseId, lesson, moduleId,video_url) => {
    await pool.query(
      `INSERT INTO lessons (course_id, module_id, title, content, video_url)
       VALUES ($1, $2, $3, $4 , $5)`,
      [courseId, moduleId, lesson.title.trim(), lesson.content.trim(),video_url]
    );
};
const addCourseData = async (req, res, media) => {
    try {
        const {
            title,
            description,
            difficulty,
            category,
            lessons,
            price
        } = req.body;
        const thumbnailUrl = media.thumbnailUrl;
        const lessonVideos = media.lessonVideos || [];
        
        // Parse lessons (sent as JSON string from frontend)
        const parsedLessons = JSON.parse(lessons || '[]');
        const course_duration = (Math.ceil(parsedLessons.length / 3)).toString() + " - " + (Math.ceil(parsedLessons.length / 3) + 1).toString() +" Weeks"
        
        // Insert into course table
        const courseResult = await pool.query(
        `INSERT INTO Courses (title, description, difficulty, category, course_thumbnail,course_price,course_duration,owner_id)
            VALUES ($1, $2, $3, $4, $5 , $6 , $7 , $8) RETURNING course_id`,
        [title, description, difficulty, category, thumbnailUrl,price,course_duration,req.user.user_id]
        );

        const courseId = courseResult.rows[0].course_id;

        // // Insert lessons with matching video URLs by index
        for (let i = 0; i < parsedLessons.length; i++) {
            const lesson = parsedLessons[i];
            const video = lessonVideos.find(v => v.index === i); // match by index
            const moduleId = await getOrCreateModuleId(courseId, lesson.topic);
            await insertLesson(courseId, lesson, moduleId, video.url);
        }

        res.status(201).json({
            message: 'Course and lessons added successfully!',
            // course_id: courseId
        });
    } catch (error) {
        console.error('Error in addCourseData:', error);
        res.status(500).json({ error: 'Failed to add course data' });
    }
};

const getAllCourses = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Courses');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error in getAllCourses:', error);
        res.status(500).json({ error: 'Failed to fetch courses' });
    }
}
const getCourseById = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const result = await pool.query('SELECT * FROM Courses WHERE course_id = $1', [courseId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error in getCourseById:', error);
        res.status(500).json({ error: 'Failed to fetch course' });
    }
}
const getLessonsAndModulesByCourseId = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const modules = await pool.query('SELECT * FROM Modules WHERE course_id = $1', [courseId]);
        const lessons = await pool.query('SELECT * FROM Lessons WHERE course_id = $1', [courseId]);
        res.status(200).json({
            modules: modules.rows,
            lessons: lessons.rows
        });
    } catch (error) {
        console.error('Error in getLessonsByCourseId:', error);
        res.status(500).json({ error: 'Failed to fetch lessons' });
    }
}

const enrollCourse = async (req, res) => {
    const userid = req.user.user_id;
    // console.log(req.user);
    
    const courseId = req.params.courseId;
    
    try {
        const result = await pool.query(
            'INSERT INTO enrollments (user_id, course_id) VALUES ($1, $2) RETURNING *',
            [userid, courseId]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error in enrollCourse:', error);
        res.status(500).json({ error: 'Failed to enroll in course' });
    }
}
const getCompletedLessons = async (req, res) => {
    const userId = req.user.user_id;
    try {
        const result = await pool.query(
            `SELECT lesson_id FROM Learning_Progress WHERE user_id = $1 AND completed = true`,
            [userId]
        );
        const lessonIDs = []
        result.rows.map((row)=>{
            lessonIDs.push(row.lesson_id)
        })

        res.status(200).json(lessonIDs);
    } catch (error) {
        console.error('Error in getCompletedLessons:', error);
        res.status(500).json({ error: 'Failed to fetch completed lessons' });
    }
}
const addCompletedLesson = async (req, res) => {
    const userId = req.user.user_id;
    const lessonId = req.params.lessonId;
    try {
        const result = await pool.query(
            `INSERT INTO Learning_Progress (user_id, lesson_id, completed) VALUES ($1, $2, true) RETURNING *`,
            [userId, lessonId]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error in addCompletedLesson:', error);
        res.status(500).json({ error: 'Failed to add completed lesson' });
    }
}
const getEnrolledCourses = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const result = await pool.query(
            `SELECT * FROM ENROLLMENTS JOIN COURSES on COURSES.course_id = ENROLLMENTS.course_id WHERE user_id = $1`,
            [userId]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error in getEnrolledCourses:', error);
        res.status(500).json({ error: 'Failed to fetch enrolled courses' });
    }
}
const getCourseProgress = async(req,res)=>{
  try {
    const userId = req.user.user_id;
    const result = await pool.query(
      `
      SELECT 
        C.course_id,
        C.title,
        COUNT(CASE WHEN LP.completed THEN 1 END)::FLOAT AS completed_lessons,
        (SELECT COUNT(*) FROM Lessons WHERE course_id = C.course_id)::FLOAT AS total_lessons
      FROM Courses C
      JOIN Lessons L ON C.course_id = L.course_id
      LEFT JOIN Learning_Progress LP ON L.lesson_id = LP.lesson_id AND LP.user_id = $1
      GROUP BY C.course_id, C.title
      HAVING COUNT(LP.user_id) > 0 -- Only include courses with at least one lesson the user has attempted
      ORDER BY C.course_id;
      `,
      [userId]
    );

    const formatted = result.rows.map(row => ({
      course_id: row.course_id,
      title: row.title,
      progress: row.total_lessons > 0 
        ? parseFloat((row.completed_lessons / row.total_lessons).toFixed(2))
        : 0.0
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error('Error calculating progress:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}
const getEnrollmentStatus = async (req, res) => {
    const userId = req.user.user_id;
    const courseId = req.params.courseId;
    try {
        const result = await pool.query(
            'SELECT * FROM enrollments WHERE user_id = $1 AND course_id = $2',
            [userId, courseId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Not enrolled in this course' });
        }
        res.status(200).json({ message: 'Enrolled in this course' });
    } catch (error) {
        console.error('Error in getEnrollmentStatus:', error);
        res.status(500).json({ error: 'Failed to fetch enrollment status' });
    }
}
const getCourseThumbnail = async (req, res) => {
    const courseId = req.params.courseId;
    try {
        const result = await pool.query('SELECT course_thumbnail FROM Courses WHERE course_id = $1', [courseId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error in getCourseThumbnail:', error);
        res.status(500).json({ error: 'Failed to fetch course thumbnail' });
    }
}    
module.exports = {
    addCourseData,
    getAllCourses,
    getLessonsAndModulesByCourseId,
    getCourseById,
    enrollCourse,
    getEnrolledCourses,
    getCourseProgress,
    getEnrollmentStatus,
    getCourseThumbnail,
    getCompletedLessons,
    addCompletedLesson,
}