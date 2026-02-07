export const fromMinutesToHours = (minutes: number) => {
  return `${Math.floor(minutes / 60)}:${minutes % 60}`;
};