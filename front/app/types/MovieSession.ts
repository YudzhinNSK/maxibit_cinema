import type { Session } from "./Session"; 
import type { Cinema } from "./Cinema";

export interface MovieSession {
  date: string;
  items:{
    id: number;
    cinema: Cinema;
    sessions: Session[];
  }[];
}