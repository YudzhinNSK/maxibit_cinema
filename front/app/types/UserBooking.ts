import type { Movie } from "./Movie";
import type { Cinema } from "./Cinema";
import type { Session } from "./Session";
export interface UserBooking {
  id: number;
  userId: number;
  movie: Movie;
  cinema: Cinema;
  session: Session;
  isPaid: boolean;
  bookedAt: Date;
  seats: {
    rowNumber: number;
    seatNumber: number;
  }[];
}