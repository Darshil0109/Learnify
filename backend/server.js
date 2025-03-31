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
                            .eq('is_email_verified', true)
                            .single();                    
        if (error) {
            return res.status(500).json({ error: 'No User Found for this email' });
        }

        if (data) {
            const {data ,  error: loginError } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });
            if (loginError) {
                return res.status(500).json({ error: loginError.message });
            }
        

            return res.status(200).json({ message: 'Login successful' });
        }
        
    } catch (error) {
        res.json({error:error.message})
    }
})
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    
    try {
        const { data : user, error :userError } = await supabase
            .from('users') // Replace 'users' with your custom table name
            .select('*')
            .eq('email', email)
            .single();
        if (user) {            
            return res.status(400).json({ error: 'User already exists' });
        }
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
          if (error.name === 'AuthWeakPasswordError') {
            res.status(400).json({ error: 'Password should contain at least 8 characters with atleast 1 uppercase, 1 lowercase, 1 number and 1 special character.' });
          }
          else{
              res.status(500).json({ error: error.name});
          }
        } else {
          res.json({ message: 'Sign-up successful' ,data});
        }
    } catch (err) {
      console.error('Server Error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });