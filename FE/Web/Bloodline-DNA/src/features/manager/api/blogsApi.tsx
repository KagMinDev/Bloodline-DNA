import rootApi from "../../../apis/rootApi";
import type { BlogResponse, BlogCreateRequest, BlogUpdateRequest } from "../types/blogs";

// Hàm GET: Lấy danh sách bài viết
export const getBlogsApi = async (): Promise<BlogResponse[]> => {
  const maxRetries = 3;
  const timeout = 10000;
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      const response = await rootApi.get<{ data: BlogResponse[] }>("/Blog", { timeout });
      if (!response.data?.data) {
        throw new Error(`Invalid response structure: ${JSON.stringify(response.data)}`);
      }
      return response.data.data;
    } catch (error) {
      attempts++;
      const errorDetails = {
        message: error instanceof Error ? error.message : "Unknown error",
        response: error instanceof Error && "response" in error ? (error as any).response?.data : undefined,
        status: error instanceof Error && "response" in error ? (error as any).response?.status : undefined,
      };
      console.error("getBlogsApi error:", errorDetails);
      if (attempts >= maxRetries) {
        throw new Error(error instanceof Error ? `Failed to get blogs: ${error.message}` : "Failed to get blogs: Unknown error");
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  throw new Error("Failed to get blogs after retries");
};

// Hàm GET: Lấy bài viết theo ID
export const getBlogByIdApi = async (id: string): Promise<BlogResponse> => {
  const timeout = 10000;
  try {
    const response = await rootApi.get<{ data: BlogResponse }>(`/Blog/${id}`, { timeout });
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
    console.error("getBlogByIdApi error:", errorDetails);
    throw new Error(error instanceof Error ? `Failed to get blog: ${error.message}` : "Failed to get blog: Unknown error");
  }
};

// Hàm POST: Tạo bài viết mới
export const createBlogApi = async (data: BlogCreateRequest): Promise<BlogResponse> => {
  const accountId = localStorage.getItem("accountId") || "";
  console.log(accountId, "accountId");
  
  try {
    const formData = new FormData();
    formData.append("Title", data.title);
    formData.append("Content", data.content);
    formData.append("ThumbnailURL", data.thumbnailURL);
    formData.append("Status", data.status.toString());
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

// Hàm PUT: Cập nhật bài viết
export const updateBlogApi = async (id: string, data: BlogUpdateRequest): Promise<BlogResponse> => {
  const accountId = localStorage.getItem("accountId") || "";
  try {
    const jsonData = {
      Id: data.id, // Include Id with capital 'I' as required by backend
      Title: data.title,
      Content: data.content,
      ThumbnailURL: data.thumbnailURL, // String or undefined
      Status: data.status,
      AuthorId: accountId,
    };

    console.log("Sending updateBlogApi payload:", jsonData); // Debug payload

    const response = await rootApi.put(`/Blog/${id}`, jsonData, {
      headers: {
        "Content-Type": "application/json",
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
    console.error('updateBlogApi error:', errorDetails);
    throw new Error(error instanceof Error ? `Failed to update blog: ${error.message}` : 'Failed to update blog: Unknown error');
  }
};

// Hàm DELETE: Xóa bài viết
export const deleteBlogApi = async (id: string): Promise<void> => {
  try {
    await rootApi.delete(`/Blog/${id}`);
  } catch (error) {
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      response: error instanceof Error && 'response' in error ? (error as any).response?.data : undefined,
      status: error instanceof Error && 'response' in error ? (error as any).response?.status : undefined,
    };
    console.error('deleteBlogApi error:', errorDetails);
    throw new Error(error instanceof Error ? `Failed to delete blog: ${error.message}` : 'Failed to delete blog: Unknown error');
  }
};