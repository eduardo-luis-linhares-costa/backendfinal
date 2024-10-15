import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  comment: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
});

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  genres: [{ type: String, required: true }],
  trailerLink: { type: String, required: true },
  poster: { type: String, required: true },
  reviews: [reviewSchema], 
});

const Movie = mongoose.model('Movie', movieSchema);
export default Movie;

