export interface Article {
  title: string;
  slug: string;
  heroImage: {
    fields: {
      file: {
        url: string;
      };
    };
  };
  publishDate: string;
}
