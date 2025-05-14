const pool = require("../config/db");
const { cloudinary } = require("../utils/cloudinary");

const   getUserData = async (req, res) => {
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
function extractPublicId(url) {
    const parts = url.split('/upload/')[1]; // after upload/
    const withoutExtension = parts.split('.')[0]; // remove .jpg/.png etc.
    const publicId = withoutExtension
      .split('/')  // split by slash
      .slice(1)    // skip the version part (e.g., v1744695425)
      .join('/');  // rejoin the rest
  
    return publicId;
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
        
        if (name){
            await pool.query(`UPDATE users SET name = $1 WHERE user_id = $2`, [name, user_id]);
        }       
        res.json({
            message: "Profile updated successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
}
const editUserImage = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        if (req.file) {
            const user = await pool.query('SELECT * FROM users WHERE user_id = $1 and profile_image IS NOT NULL', [user_id]);
            if (user.rows.length > 0) {
                const publicId = extractPublicId(user.rows[0].profile_image);
                await cloudinary.uploader.destroy(publicId);
            }
            await pool.query(`UPDATE users SET profile_image = $1 WHERE user_id = $2`, [req.file?.path, user_id]);
        }
        if (req.file) {
            res.json({
                message: "Profile Image updated successfully",
                profile_image: req.file.path
            });
        }
        else{

            res.json({
                message: "Profile Image updated successfully",
            });
            
        }
        
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

const deleteUser = async (req, res) => {
    try {
        if(req.cookies.refreshToken){
            const user_id = req.user.user_id;
            const auth = req.cookies.auth;
            if (auth === 'google') {
                req.logout(err => {
                if (err) return res.status(500).json({ message: "Logout failed" });
            
                    req.session.destroy(async err => {
                        if (err) return res.status(500).json({ message: "Session destruction failed" });
                
                        // Now delete the user from the DB
                        await pool.query("DELETE FROM users WHERE user_id = $1", [user_id]);
                    });
                });
            }
            else{
                await pool.query("DELETE FROM users WHERE user_id = $1", [user_id]);
            }
            const isProduction = process.env.NODE_ENV === "PRODUCTION";
            if (process.env.DOMAIN) {
                res.clearCookie('accessToken', {
                    domain: process.env.DOMAIN ,
                    httpOnly: false,
                    secure: isProduction,
                    sameSite: isProduction ? 'none' : 'lax',
                    path: '/',            // must match the path it was set with
                });  
            }
            else{
                res.clearCookie('accessToken', {
                    httpOnly: false,
                    secure: isProduction,
                    sameSite: isProduction ? 'none' : 'lax',
                    path: '/',            // must match the path it was set with
                });
            }
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction ? 'none' : 'lax',
                path: '/',
            });
            res.clearCookie('auth', {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction ? 'none' : 'lax',
                path: '/',
            });
            res.status(200).json({
                message: "User deleted successfully"
            });
        }
        res.status(400).json({
            message: "User Cannot be Deleted"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
}
const getUserById = async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [user_id]);
        const user = result.rows[0];
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({user_id:user.user_id,name:user.name,profile_image:user.profile_image});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
}
module.exports = {
    getUserById,
    getUserData,
    editUserData,
    getUserSkills,
    editUserImage,
    deleteUser,
}