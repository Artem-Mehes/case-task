export interface Course {
  id: string;
  title: string;
  tags: string[];
  rating: number;
  launchDate: string;
  description: string;
  lessonsCount: number;
  previewImageLink: string;
  meta: {
    skills?: string[];
    courseVideoPreview: {
      link: string;
      duration: number;
      previewImageLink: string;
    };
  };
}
