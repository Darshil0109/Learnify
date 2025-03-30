const express = require('express');
const app = express();
const supabase = require('./supabaseClient');
const cors = require('cors');
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT || 5000}`);  
})

app.get('/', (req, res) => {
    res.send("Welcome to Learnify API!");
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const {data , error} = await supabase
                            .from('users')
                            .select('*')
                            .eq('auth_provider',"email")
                            .eq('email', email)
                            .single();                    
        const hashedPassword = data.password_hash;
        const isMatch = await bcrypt.compare(password, hashedPassword);
        if (!isMatch) {
            res.status(401).json({message : "Invalid Email or Password"})
        }
        else{
            res.json({
                message : "Login Successful",
                data : {
                    user_id : data.user_id,
                    name: data.name,
                    email : data.email,
                    profile_image : data.profile_image,
                    role:data.role,
                }
            })
        }
        
    } catch (error) {
        res.json({error:error.message})
    }
})
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    
    try {
        const { data, error } = await supabase.auth.signUp({
          email: email,
          password: password,
          options: {
            emailRedirectTo:`${process.env.CLIENT_URL}/auth/callback`,
            data: { 
                full_name: name // Make sure this matches the key you expect
            }
          },
        })
        
        if (error) {
          console.error('Sign-up error:', error);
          res.status(500).json({ error: 'Sign-up failed' ,error});
        } else {
          res.json({ message: 'Sign-up successful' ,data});
        }
    } catch (err) {
      console.error('Server Error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });