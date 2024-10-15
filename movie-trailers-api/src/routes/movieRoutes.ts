import express from 'express';
import Movie from '../models/Movie';
import { authenticateJWT } from '../middleware/authMiddleware';
import User from '../models/User';

const router = express.Router();

// @ts-ignore
router.post('/:id/review', authenticateJWT, async (req, res) => {
  const { comment, rating } = req.body;

  if (!comment || !rating) {
    return res.status(400).json({ message: 'Comment and rating are required' });
  }

  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    movie.reviews.push({
      //@ts-ignore
      user: req.user.id,
      comment,
      rating,
    });

    await movie.save();
    res.status(201).json(movie.reviews);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// @ts-ignore
router.get('/movies', authenticateJWT, async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json(movies);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// @ts-ignore
router.get('/movies/search', authenticateJWT, async (req, res) => {
  const { releaseYear, name, genre, sortBy, page = 1, limit = 10 } = req.query;

  const query: any = {};
  if (releaseYear) query.releaseDate = { $regex: releaseYear, $options: 'i' };
  if (name) query.title = { $regex: name, $options: 'i' };
  if (genre) query.genres = { $in: [genre] };

  const options = {
    sort: sortBy ? { releaseDate: sortBy === 'desc' ? -1 : 1 } : {},
    skip: (Number(page) - 1) * Number(limit),
    limit: Number(limit),
  };

  try {
    const movies = await Movie.find(query, null, options);
    const total = await Movie.countDocuments(query);
    res.status(200).json({ movies, total });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// @ts-ignore
router.post('/movies', authenticateJWT, async (req, res) => {
  const { title, releaseDate, trailerLink, poster, genres } = req.body;
  try {
    const newMovie = new Movie({ title, releaseDate, trailerLink, poster, genres });
    await newMovie.save();
    res.status(201).json(newMovie);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// @ts-ignore
router.put('/movies/:id', authenticateJWT, async (req, res) => {
  const movieId = req.params.id;
  const { title, releaseDate, trailerLink, poster, genres } = req.body;
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(movieId, { title, releaseDate, trailerLink, poster, genres }, { new: true });
    res.status(200).json(updatedMovie);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// @ts-ignore
router.delete('/movies/:id', authenticateJWT, async (req, res) => {
  const movieId = req.params.id;
  try {
    await Movie.findByIdAndDelete(movieId);
    res.status(204).json({ message: 'Filme deletado com sucesso.' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

