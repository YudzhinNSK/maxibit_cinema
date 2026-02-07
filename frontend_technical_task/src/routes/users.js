import { Router } from 'express';
import { authenticateToken } from '../auth.js';
import { bookings, movieSessions, cinemas, movies } from '../data/index.js';
const router = Router();

/**
 * @openapi
 * /me/bookings:
 *   get:
 *     summary: Получить список бронирований пользователя
 *     description: Возвращает список всех бронирований, сделанных текущим аутентифицированным пользователем.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список бронирований пользователя
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 *       401:
 *         description: Неавторизованный доступ. Отсутствует или недействителен токен аутентификации.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Внутренняя ошибка сервера.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/me/bookings', authenticateToken, (req, res) => {
  try {
    const user = req.user;
    if (!user || !user.id) {
      return res.status(401).json({ message: 'Неавторизованный доступ' });
    }
    const userBookings = bookings.filter((booking) => booking.userId === user.id);

    const userBookingsWithMovieSession = userBookings.map((booking) => {
      const session = movieSessions.find((movieSession) => movieSession.id === booking.movieSessionId);
      const cinema = cinemas.find((cinema) => cinema.id === session.cinemaId);
      const movie = movies.find((movie) => movie.id === session.movieId);
      return {
        ...booking,
        session,
        cinema,
        movie,
      };
    });

    res.json(userBookingsWithMovieSession);
  } catch (error) {
    console.error('Ошибка при получении бронирований:', error);
    res.status(500).json({ message: 'Ошибка при получении бронирований' });
  }
});

export default router;
