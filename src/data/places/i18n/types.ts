/** A place's text in one language. Names stay as they are unless `name` is given. Same order of `insights` as the English. */
export interface PlaceI18n {
  name?: string;
  region: string;
  brief: string;
  bestTime: string;
  /** [why stop here, what to see, the story, best moment, good to know] */
  insights: [string, string, string, string, string];
}
