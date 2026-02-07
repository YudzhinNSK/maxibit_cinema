import { Router } from 'express';
import { movies, cinemas, movieSessions } from'../data/index.js';

const router = Router();

/**
 * @openapi
 * /movies:
 *   get:
 *     summary: Получить список фильмов
 *     description: Возвращает список всех доступных фильмов.
 *     tags:
 *       - Movies
 *     responses:
 *       200:
 *         description: Список фильмов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 */
router.get('/movies', async (req, res) => {
  res.json(movies);
});

/**
 * @openapi
 * /movies/{movieId}:
 *   get:
 *     summary: Получить фильм по идентификатору
 *     description: Возвращает информацию о фильме по его идентификатору.
 *     tags:
 *       - Movies
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Информация о фильме
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       404:
 *         description: Фильм не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/movies/:movieId(\\d+)', (req, res) => {
  const movieId = Number.parseInt(req.params.movieId);
  const movie = movies.find(({ id }) => id === movieId);

  if (!movie) {
    return res.status(404).json({ message: 'Фильм не найден' });
  }

  res.json(movie);
});

/**
 * @openapi
 * /movies/{movieId}/sessions:
 *   get:
 *     summary: Получить список киносеансов для фильма
 *     description: Возвращает список всех доступных киносеансов для указанного фильма.
 *     tags:
 *       - Movies
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: integer
 *           description: Идентификатор фильма
 *     responses:
 *       200:
 *         description: Список киносеансов с фильмом
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MovieSession'
 *       404:
 *         description: Фильм не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.get('/movies/:movieId(\\d+)/sessions', async (req, res) => {
  const movieId = Number.parseInt(req.params.movieId);
  const movie = movies.find(({ id }) => id === movieId);

  if (!movie) {
    return res.status(404).json({ message: 'Фильм не найден' });
  }

  const cinemaMap = {}
  cinemas.forEach((cinema) => {
    cinemaMap[cinema.id] = cinema;
  });

  const movieMap = {}
  movies.forEach((movie) => {
    movieMap[movie.id] = movie;
  });

  const sessions = movieSessions
    .filter((session) => session.movieId === movieId)
    .map(({ seats, ...session }) => {
      const newSession = {
        ...session,
        cinema: cinemaMap[session.cinemaId],
        movie: movieMap[session.movieId],
      }
      delete newSession.cinemaId;
      delete newSession.movieId;
      return newSession;
    });

  res.json(sessions);
});

export default router;
