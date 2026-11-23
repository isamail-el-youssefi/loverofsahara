/**
 * The words of the contact page, the gallery page's search tags, the blog (list and article pages) and the last
 * pieces of the home page (reviews, photo collage), in every language. Same idea as src/i18n/site: pure data, one
 * file per language, each typed with this interface so a missing key is a compile error.
 */
type T3<T> = [T, T, T];
type T4<T> = [T, T, T, T];
type T5<T> = [T, T, T, T, T];
type T7<T> = [T, T, T, T, T, T, T];

export interface PageStrings {
  contact: {
    seoTitle: string;
    seoDescription: string;
    name: string;
    kicker: string;
    h1a: string;
    h1b: string;
    getInTouch: string;
    writeTitle: string;
    writeText: string;
    tripRequest: string;
    howEyebrow: string;
    howTitle: string;
    steps: T3<{ title: string; text: string }>;
    whereEyebrow: string;
    whereTitle: string;
    whereText: string;
    tabs: T5<string>;
    /** "{name}" and "{role}" are filled in. */
    talking: string;
    /** "{langs}" is filled in with the list of languages, joined with "or". */
    born: string;
    emailLabel: string;
    phoneLabel: string;
    splitEyebrow: string;
    splitH1a: string;
    splitH1b: string;
    form: {
      aria: string;
      name: string;
      email: string;
      trip: string;
      tripNone: string;
      dates: string;
      datesPh: string;
      group: string;
      groupPh: string;
      message: string;
      messagePh: string;
      whatsapp: string;
      emailBtn: string;
      hintIdle: string;
      hintWhatsapp: string;
      hintEmail: string;
      errName: string;
      errEmail: string;
      errMessage: string;
      /** First line of the message that arrives in WhatsApp or the mail app. */
      hello: string;
      lName: string;
      lEmail: string;
      lTrip: string;
      lDates: string;
      lGroup: string;
      notDecided: string;
      /** "{trip}" is filled in. */
      subjectTrip: string;
      subjectNone: string;
    };
  };
  gallery: { seoTitle: string; seoDescription: string; name: string };
  blog: { seoTitle: string; seoDescription: string; name: string; h2: string; lead: string; crumb: string };
  article: {
    home: string;
    blog: string;
    by: string;
    published: string;
    updated: string;
    share: string;
    save: string;
    shareTitle: string;
    saveTitle: string;
    written: string;
    /** "{role}" is filled in. */
    writtenTail: string;
    allStories: string;
    next: string;
    imgAlt: [string, string, string];
  };
  home: {
    reviews: {
      eyebrow: string;
      h2a: string;
      h2b: string;
      aria: string;
      source: string;
      /** "{lang}" is filled in with the language's own name. */
      original: string;
      readAll: string;
    };
    collage: {
      h2a: string;
      h2b: string;
      button: string;
      alts: T7<string>;
      phone: T4<{ alt: string; label: string; location: string }>;
    };
  };
}
