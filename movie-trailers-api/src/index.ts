import express from 'express';
import cors from 'cors'
import mongoose from 'mongoose'

const app = express(); 

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://octavioflfigueiredo:Kbju8275.@octavio.d1k161h.mongodb.net/')
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Could not connect to MongoDB...', err));

app.use('/auth', require('./routes/authRoutes'));
app.use('/api/movies', require('./routes/movieRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

