export interface Testimonial {
  content: string;
  name: string;
  location: string;
  rating: number;
}

export interface TeamMember {
  name: string;
  title: string;
  image: string;
}

export interface BlogPost {
  id: string;
  title: string;
  description: string;
  link: string;
}

export interface FAQ {
  question: string;
  answer: string;
  key: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface ProcessStep {
  icon: string;
  title: string;
  description: string;
}

export interface TrustIndicator {
  value: string;
  label: string;
}
