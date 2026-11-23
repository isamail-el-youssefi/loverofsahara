/** The words of one blog article in one language. Photos, ids and authors' names are the same in every language
 *  and stay in `data/articles.ts`; `sections` lines up one to one with that file's sections. */
export interface SectionText {
  heading?: string;
  paragraphs: string[];
  quote?: string;
  quoteAuthor?: string;
  highlights?: { title: string; desc: string }[];
  caption?: string;
  secondaryCaption?: string;
}

export interface ArticleText {
  category: string;
  title: string;
  authorRole: string;
  published: string;
  updated: string;
  readTime: string;
  lead: string;
  /** Description of the photo on the list and at the top of the article. */
  alt: string;
  /** Second line of the card on the blog list: "Desert Guide • Oct 14, 2025". */
  listMeta: string;
  sections: SectionText[];
}

export type ArticleTexts = Record<number, ArticleText>;
