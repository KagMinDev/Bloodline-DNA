import { CalendarIcon, ShareIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { BlogPost } from "../../../types/blogs.types";

interface PostCardProps {
  post: BlogPost;
  formatDate: (dateString: string) => string;
  isFeatured: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  formatDate,
  isFeatured,
}) => {
  const navigate = useNavigate();

  const handleReadMore = () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const basePath = user?.role === "Client" ? "/customer" : "";
    navigate(`${basePath}/blogs/${post.id}`);
  };

  return (
    <div
      className={`overflow-hidden bg-white transition-all duration-300 ${
        isFeatured
          ? "border-0 hover:shadow-2xl hover:-translate-y-2"
          : "border-2 border-gray-200 hover:shadow-xl hover:border-gray-300 rounded-2xl hover:-translate-y-1"
      }`}
    >
      <div className={isFeatured ? "" : "flex flex-col md:flex-row"}>
        {/* Ảnh */}
        <div
          className={`relative ${
            isFeatured ? "h-64" : "h-48 md:w-64 md:h-48"
          } overflow-hidden`}
        >
          <img
            src={post.thumbnailURL}
            alt={post.title}
            className={`object-cover w-full h-full transition-transform duration-300 ${
              isFeatured ? "hover:scale-110" : "hover:scale-105"
            }`}
          />
        </div>

        {/* Nội dung */}
        <div
          className={`p-${
            isFeatured ? "6" : "5"
          } flex flex-col justify-between ${isFeatured ? "" : "flex-1"}`}
        >
          <div>
            <h3
              className={`mb-3 text-${
                isFeatured ? "xl" : "lg md:text-xl"
              } font-bold text-blue-900 line-clamp-2`}
            >
              {post.title}
            </h3>
            <p className="text-sm text-slate-600 line-clamp-3">
              {post.content}
            </p>
          </div>

          <div className="flex items-center mb-4">
            <p
              className={`text-${isFeatured ? "sm" : "xs"} font-${
                isFeatured ? "semibold" : "bold"
              } text-blue-900`}
            >
              {post.authorName}
            </p>
          </div>

          <div className="flex items-center justify-between mb-4 text-sm text-slate-500">
            <div className="flex items-center">
              <CalendarIcon className="w-4 h-4 mr-1" />
              {formatDate(post.createdAt)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Nút Đọc thêm */}
            <button
              onClick={handleReadMore}
              style={{
                color: "white",
              }}
              className={`bg-blue-900 text-sm py-2 px-5 rounded-xl transition-all duration-200 hover:bg-blue-700`}
            >
              Đọc Thêm
            </button>

            {/* Nút Chia sẻ */}
            <button
              className={`group border border-blue-900 text-blue-900 text-sm py-2 px-5 rounded-xl flex items-center justify-center gap-1 transition-all duration-200 hover:bg-blue-700 hover:text-white`}
            >
              <ShareIcon className="w-4 h-4 transition-all duration-200 group-hover:text-white" />
              <span className="transition-all duration-200 group-hover:text-white">
                Chia Sẻ
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
