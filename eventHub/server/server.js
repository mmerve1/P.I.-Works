// server.js
//çalışan kodd
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const authController = require('./authController');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'event',
  password: 'merve2302',
  port: 5432,
});

app.post('/api/register', (req, res) => authController.register(req, res, pool));
app.post('/api/login', (req, res) => authController.login(req, res, pool));
app.post('/api/reset', (req, res) => authController.resetPassword(req, res, pool));
const startServer = async () => {
  const testUser = {
    first_name: "Merve",
    last_name: "Yılmaz",
    email: "merve@example.com",
    username: "merveyilmaz",
    password: "merve123",
    location: "Istanbul",
    interests: ["tech", "music"],
    date_of_birth: "1995-01-01",
    gender: "female",
    phone_number: "1234567890",
    profile_picture: "https://example.com/profile.jpg",
  };

  try {
    
    await pool.query(
      `INSERT INTO users (first_name, last_name, email, username, password, location, interests, date_of_birth, gender, phone_number, profile_picture)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        testUser.first_name,
        testUser.last_name,
        testUser.email,
        testUser.username,
        testUser.password,
        testUser.location,
        testUser.interests.join(','), 
        testUser.date_of_birth,
        testUser.gender,
        testUser.phone_number,
        testUser.profile_picture,
      ]
    );

    console.log('Veritabanı işlemleri tamamlandı.');
  } catch (error) {
    console.error('Veritabanı işlemleri sırasında hata:', error.message);
  }
};















app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    console.log("Fetched users:", result.rows); // Log the fetched users
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).send('Server Error');
  }
});

app.put('/api/users/update', async (req, res) => {  
  const { userId, first_name, last_name, email, interests,username, phone_number, profile_picture } = req.body;  

  // Gerekli alanların kontrolü  
  if (!userId || !first_name || !last_name || !email || !interests || !username) {  
    return res.status(400).json({ error: 'All fields are required.' });  
  }  

  try {  
    // Kullanıcıyı güncelleyen SQL sorgusu  
    await pool.query(  
      'UPDATE users SET first_name = $1, last_name = $2, email = $3, interests = $4 ,username = $5, phone_number = $6, profile_picture = $7 WHERE id = $8',  
      [first_name, last_name, email, interests ,username, phone_number, profile_picture, userId]  
    );  

    // Güncellenen kullanıcı bilgilerini tekrar al  
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);  
    const updatedUser = result.rows[0];  

    // Başarılı güncelleme yanıtı  
    res.status(200).json({ message: 'User updated successfully', user: updatedUser });  
  } catch (error) {  
    console.error('Error during user update:', error.message);  
    res.status(500).json({ error: 'Server error. Please try again.' });  
  }  
});  








//YENİ EKLEDİM
app.post('/api/events/:eventId/messages', async (req, res) => {
  const { eventId } = req.params;
  const { senderId, messageText } = req.body;

  if (!senderId || !messageText) {
    return res.status(400).json({ error: 'Mesaj içeriği ve gönderen ID gereklidir.' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO messages (event_ID, sender_ID, message_text) VALUES ($1, $2, $3) RETURNING *',
      [eventId, senderId, messageText]
    );
    res.status(201).json({ message: 'Mesaj başarıyla gönderildi.', data: result.rows[0] });
  } catch (error) {
    console.error('Mesaj gönderme sırasında hata:', error.message);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
});








app.get('/api/users/:userId/score', async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      'SELECT SUM(score) AS total_score FROM Scores WHERE user_ID = $1',
      [userId]
    );

    const totalScore = result.rows[0]?.total_score || 0;

    res.status(200).json({ userId, totalScore });
  } catch (error) {
    console.error('Puan bilgisi alınırken hata:', error.message);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
});



// Sunucu dinleme
const PORT = 5001;  // Port numarası
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});