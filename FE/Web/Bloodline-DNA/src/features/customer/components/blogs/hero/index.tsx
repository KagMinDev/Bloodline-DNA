import { BookmarkIcon, HeartIcon, TrendingUpIcon } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "../../../../services/components/ui/Breadcrumb";

interface BlogHeroProps {
  isVisible: boolean;
}

export const BlogHero: React.FC<BlogHeroProps> = ({ isVisible }) => {
  return (
    <section className="relative h-[400px] overflow-hidden bg-gradient-to-br from-[#0066CC] to-[#003875]">
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <defs>
            <pattern id="medical-cross-blog" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect x="8" y="4" width="4" height="12" fill="white" />
              <rect x="4" y="8" width="12" height="4" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#medical-cross-blog)" />
        </svg>
      </div>

      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-16 h-16 rounded-full bg-white/10 animate-pulse flex items-center justify-center">
          <BookmarkIcon className="w-8 h-8 text-white/60" />
        </div>
        <div className="absolute bottom-32 right-32 w-12 h-12 rounded-full bg-white/10 animate-bounce flex items-center justify-center">
          <TrendingUpIcon className="w-6 h-6 text-white/60" />
        </div>
        <div className="absolute top-32 left-32 w-14 h-14 rounded-full bg-white/10 animate-pulse flex items-center justify-center">
          <HeartIcon className="w-7 h-7 text-white/60" />
        </div>
      </div>

      <div className="relative flex items-center h-full">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}>
            <Breadcrumb
             className="mb-6">
              <BreadcrumbList className="text-white/90">
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="text-white/80 hover:text-white">
                    Trang Chủ
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-white/60" />
                <BreadcrumbItem>
                  <span className="text-[#00D4FF] font-semibold">Blog Y Tế</span>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h1 className="mb-4 text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              Blog Y Tế
              <span className="block text-[#00D4FF] text-2xl md:text-3xl lg:text-4xl mt-1">
                Kiến Thức Sức Khỏe
              </span>
            </h1>
            <p className="max-w-lg mb-6 text-base md:text-lg text-white/90">
              Khám phá những bài viết chuyên sâu về sức khỏe, y học và lối sống khỏe mạnh từ đội ngũ chuyên gia.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};