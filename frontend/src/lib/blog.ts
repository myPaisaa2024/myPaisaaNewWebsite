import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";

// Hand-written mirror of the BlogPost Pydantic model in backend/models/blog.py.
export interface BlogPost {
  title: string;
  link: string;
  excerpt: string;
  image: string | null;
  published: string | null;
}

const fetchBlogPosts = () => apiGet<BlogPost[]>("/blog/posts");

/** Latest real posts from blog.mypaisaa.com, fetched server-side and cached. */
export function useBlogPosts() {
  return useQuery({
    queryKey: ["blog-posts"],
    queryFn: fetchBlogPosts,
    staleTime: 10 * 60 * 1000,
  });
}
