import type { Seat } from "./Seat";

export interface SessionDetails {
  id: number;
  movieId: number;
  cinemaId: number;
  startTime: Date;
  seats: {
    rows: number;
    seatPerRow: number;
  };
  bookedSeats: Seat[];
}