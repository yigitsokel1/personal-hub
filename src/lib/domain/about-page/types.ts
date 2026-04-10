export type AboutSection = {
  heading: string;
  body: string;
};

export type AboutPageContent = {
  title: string;
  intro: string;
  sections: AboutSection[];
  updatedAt?: string;
};

export type AboutPageInput = {
  title: string;
  intro: string;
  sections: AboutSection[];
};
