export interface Author {
  avatarUrl: string;
  name: string;
  role: string;
}

export interface Content {
  content: string;
  type: 'paragraph' | 'link';
}

export interface PostType {
  id: number;
  author: Author;
  content: Content[];
  publishedAt: Date;
}

export interface PostProps {
  post: PostType;
}
