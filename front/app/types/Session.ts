import type { Movie } from "./Movie";
import type { Cinema } from "./Cinema";

export interface Session {
  id: number;
  movie: Movie;
  cinema: Cinema;
  startTime: string;
}