import rootApi from "../../../apis/rootApi";
import type { BlogRequest, BlogResponse } from "../types/blogs";

// Hàm GET: Lấy danh sách bài viết
export const getBlogsApi = async (): Promise<BlogResponse[]> => {
  try {
    const response = await rootApi.get<{ data: BlogResponse[] }>("/Blog");
    if (!response.data?.data) {
      throw new Error(`Invalid response structure: ${JSON.stringify(response.data)}`);
    }
    return response.data.data;
  } catch (error) {
    const errorDetails = {
      message: error instanceof Error ? error.message : "Unknown error",
      response: error instanceof Error && "response" in error ? (error as any).response?.data : undefined,
      status: error instanceof Error && "response" in error ? (error as any).response?.status : undefined,
    };
    console.error("getBlogsApi error:", errorDetails);
    throw new Error(error instanceof Error ? `Failed to get blogs: ${error.message}` : "Failed to get blogs: Unknown error");
  }
};

// Hàm POST: Tạo bài viết mới
export const createBlogApi = async (data: BlogRequest): Promise<BlogResponse> => {
    const accountId = localStorage.getItem("accountId") || "";
    console.log(accountId, "accountId");
    
  try {
    const formData = new FormData();
    formData.append("Title", data.title);
    formData.append("Content", data.content);
    formData.append("ThumbnailURL", data.thumbnailURL);
    formData.append("Status", data.status.toString());
    // formData.append("AuthorId", data.authorId);
    formData.append("AuthorId", accountId);

    const response = await rootApi.post("/Blog", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (!response.data) {
      throw new Error(`Invalid response structure: ${JSON.stringify(response.data)}`);
    }

    return response.data as BlogResponse;
  } catch (error) {
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      response: error instanceof Error && 'response' in error ? (error as any).response?.data : undefined,
      status: error instanceof Error && 'response' in error ? (error as any).response?.status : undefined,
    };
    console.error('createBlogApi error:', errorDetails);
    throw new Error(error instanceof Error ? `Failed to create blog: ${error.message}` : 'Failed to create blog: Unknown error');
  }
};