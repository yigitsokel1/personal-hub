/**
 * Toggle homepage blocks without restructuring the page. Empty content arrays still
 * hide sections (e.g. no featured work when the list is empty).
 */
export const homepageSections = {
  featuredWork: true,
  featuredProjects: true,
  writing: true,
  labs: true,
  about: false,
} as const;
