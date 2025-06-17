export interface BlogResponse {
  id: string;
  title: string;
  content: string;
  thumbnailURL: string;
  status: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogRequest {
  title: string;
  content: string;
  thumbnailURL: File; 
  status: number;
  authorId: string;
}