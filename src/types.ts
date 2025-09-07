export interface Exercise {
  id: string;
  name: string;
  sets: string;
  reps: string;
  weight: string;
  youtubeLink: string;
}

export interface Routine {
  id: string;
  name: string;
  exercises: Exercise[];
}

export interface Workout {
  id: string;
  routine: Routine;
  date: Date;
  duration: number;
}
