import type { Movie } from "./Movie";
import type { Session } from "./Session";

export interface CinemaSession {
  date: string;
  items:{
    id: number;
    movie: Movie;
    sessions: Session[];
  }[];
}