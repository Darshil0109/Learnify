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
module.exports = {
    addCourseData,
    getAllCourses,
    getLessonsAndModulesByCourseId,
    getCourseById,
}