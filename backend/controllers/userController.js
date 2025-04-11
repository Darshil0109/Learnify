const pool = require("../config/db");
const getUserData = async (req, res) => {
    const user_id = req.user.user_id;
    const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [user_id]);
    const user = result.rows[0];
    res.json({
        user_id: user.user_id,
        email: user.email,
        name: user.name,
        profile_image: user.profile_image,
        role: user.role,
        is_verified: user.is_verified,
        created_at: user.created_at,
    });
}

const editUserData = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const { name } = req.body;
        let skills = [];
        try {
        skills = JSON.parse(req.body.skills);
        } catch (err) {
        return res.status(400).json({ error: "Invalid skills format. Must be JSON array." });
        }
        await pool.query("DELETE from user_skills where user_id = $1", [user_id]);
        if (skills.length > 0) {
            const insertValues = skills.map((id, index) => `($1, $${index + 2})`).join(', ');
            const values = [user_id, ...skills];
            await pool.query(`INSERT INTO user_skills (user_id, skill_id) VALUES ${insertValues}`, values);
        }
        await pool.query(`UPDATE users SET name = $1, profile_image = $2 WHERE user_id = $3`, [name,req.file?.path, user_id]);
        res.json({
            message: "Profile updated successfully"
        }); 
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
}
const getUserSkills = async(req,res) =>{
    try {
        const user_id = req.user.user_id;
        const result = await pool.query("SELECT skill_id FROM user_skills WHERE user_id = $1", [user_id]);
        const user_skills = result.rows.map(row => row.skill_id);
        res.json(user_skills);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
}   

module.exports = {
    getUserData,
    editUserData,
    getUserSkills
}