import React, { useEffect, useState } from "react";
import { 
  CalendarIcon,
  ClockIcon,
  EyeIcon,
  TagIcon,
  SearchIcon,
  HeartIcon,
  ShareIcon,
  BookmarkIcon,
  TrendingUpIcon,
  AwardIcon,
  StethoscopeIcon
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../components/ui/Breadcrumb";
import { Header } from "../../../components";
import { Footer } from "../../../components";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  authorAvatar: string;
  authorRole: string;
  publishDate: string;
  readTime: string;
  views: number;
  likes: number;
  category: string;
  tags: string[];
  image: string;
  featured: boolean;
}

interface Category {
  id: string;
  name: string;
  count: number;
}

export const Blogs = (): React.JSX.Element => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);

  const categories: Category[] = [
    { id: "all", name: "Tất Cả", count: 12 },
    { id: "health-tips", name: "Mẹo Sức Khỏe", count: 4 },
    { id: "medical-news", name: "Tin Tức Y Tế", count: 3 },
    { id: "nutrition", name: "Dinh Dưỡng", count: 2 },
    { id: "lifestyle", name: "Lối Sống", count: 3 }
  ];

  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "10 Cách Đơn Giản Để Tăng Cường Hệ Miễn Dịch Tự Nhiên",
      excerpt: "Khám phá những phương pháp tự nhiên và hiệu quả để tăng cường sức đề kháng, giúp cơ thể khỏe mạnh và chống lại bệnh tật...",
      author: "BS. Nguyễn Thị Lan",
      authorAvatar: "https://c.animaapp.com/mbgey19id5YPrV/img/rectangle-20-5.png",
      authorRole: "Bác sĩ Nội khoa",
      publishDate: "2024-01-15",
      readTime: "5 phút đọc",
      views: 1240,
      likes: 89,
      category: "health-tips",
      tags: ["miễn dịch", "sức khỏe", "phòng bệnh"],
      image: "https://i.postimg.cc/YSFzZ4VZ/9e0e121abaf50eab57e4.jpg",
      featured: true
    },
    {
      id: 2,
      title: "Chế Độ Ăn Uống Khoa Học Cho Người Bệnh Tim Mạch",
      excerpt: "Hướng dẫn chi tiết về chế độ dinh dưỡng phù hợp cho người mắc bệnh tim mạch, giúp kiểm soát tình trạng và cải thiện sức khỏe...",
      author: "BS.CK2 Trần Văn Minh",
      authorAvatar: "https://c.animaapp.com/mbgey19id5YPrV/img/rectangle-20-5.png",
      authorRole: "Bác sĩ Tim mạch",
      publishDate: "2024-01-12",
      readTime: "7 phút đọc",
      views: 956,
      likes: 67,
      category: "nutrition",
      tags: ["tim mạch", "dinh dưỡng", "chế độ ăn"],
      image: "https://i.postimg.cc/YSFzZ4VZ/9e0e121abaf50eab57e4.jpg",
      featured: true
    },
    {
      id: 3,
      title: "Công Nghệ AI Trong Y Tế: Tương Lai Của Ngành Y",
      excerpt: "Tìm hiểu về những ứng dụng mới nhất của trí tuệ nhân tạo trong chẩn đoán và điều trị bệnh, mở ra kỷ nguyên mới cho y học...",
      author: "TS. Lê Quang Huy",
      authorAvatar: "https://c.animaapp.com/mbgey19id5YPrV/img/rectangle-20-5.png",
      authorRole: "Tiến sĩ Y học",
      publishDate: "2024-01-10",
      readTime: "8 phút đọc",
      views: 1456,
      likes: 123,
      category: "medical-news",
      tags: ["AI", "công nghệ", "y tế", "tương lai"],
      image: "https://i.postimg.cc/YSFzZ4VZ/9e0e121abaf50eab57e4.jpg",
      featured: true
    },
    {
      id: 4,
      title: "Yoga và Thiền: Liệu Pháp Tự Nhiên Cho Căng Thẳng",
      excerpt: "Khám phá lợi ích của yoga và thiền định trong việc giảm stress, cải thiện sức khỏe tinh thần và thể chất...",
      author: "BS. Phạm Thị Hoa",
      authorAvatar: "https://c.animaapp.com/mbgey19id5YPrV/img/rectangle-20-5.png",
      authorRole: "Bác sĩ Tâm lý",
      publishDate: "2024-01-08",
      readTime: "6 phút đọc",
      views: 782,
      likes: 54,
      category: "lifestyle",
      tags: ["yoga", "thiền", "căng thẳng", "sức khỏe tinh thần"],
      image: "https://i.postimg.cc/YSFzZ4VZ/9e0e121abaf50eab57e4.jpg",
      featured: false
    },
    {
      id: 5,
      title: "Tầm Quan Trọng Của Việc Khám Sức Khỏe Định Kỳ",
      excerpt: "Tại sao khám sức khỏe định kỳ lại quan trọng và những xét nghiệm cần thiết theo từng độ tuổi...",
      author: "BS. Hoàng Văn Nam",
      authorAvatar: "https://c.animaapp.com/mbgey19id5YPrV/img/rectangle-20-5.png",
      authorRole: "Bác sĩ Đa khoa",
      publishDate: "2024-01-05",
      readTime: "4 phút đọc",
      views: 634,
      likes: 41,
      category: "health-tips",
      tags: ["khám định kỳ", "phòng bệnh", "sức khỏe"],
      image: "https://i.postimg.cc/YSFzZ4VZ/9e0e121abaf50eab57e4.jpg",
      featured: false
    },
    {
      id: 6,
      title: "Bí Quyết Ngủ Ngon Và Tầm Quan Trọng Của Giấc Ngủ",
      excerpt: "Những mẹo khoa học để có giấc ngủ chất lượng và hiểu rõ tác động của giấc ngủ đến sức khỏe tổng thể...",
      author: "BS. Nguyễn Thị Mai",
      authorAvatar: "https://c.animaapp.com/mbgey19id5YPrV/img/rectangle-20-5.png",
      authorRole: "Bác sĩ Thần kinh",
      publishDate: "2024-01-03",
      readTime: "5 phút đọc",
      views: 892,
      likes: 76,
      category: "lifestyle",
      tags: ["giấc ngủ", "nghỉ ngơi", "sức khỏe"],
      image: "https://i.postimg.cc/YSFzZ4VZ/9e0e121abaf50eab57e4.jpg",
      featured: false
    }
  ];

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    let filtered = blogPosts;
    
    if (selectedCategory !== "all") {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredPosts(filtered);
  }, [selectedCategory, searchTerm]);

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`;
    }
    return views.toString();
  };

  return (
    <div className="bg-gradient-to-b from-[#fcfefe] to-gray-50 min-h-screen w-full">
      <div className="w-full max-w-none relative">
        {/* Header */}
        <div className="fixed w-full z-50">
          <Header />
        </div>

        {/* Hero Section - Medical Style */}
        <section className="relative w-full h-[320px] md:h-[360px] lg:h-[400px] overflow-hidden bg-gradient-to-br from-[#0066CC] via-[#0052A3] to-[#003875]">
          {/* Medical Pattern Background */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="medical-cross-blog" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <rect x="8" y="4" width="4" height="12" fill="white"/>
                  <rect x="4" y="8" width="12" height="4" fill="white"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#medical-cross-blog)" />
            </svg>
          </div>

          {/* Decorative Medical Elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Floating medical icons */}
            <div className="absolute top-20 right-20 w-16 h-16 bg-white/10 rounded-full flex items-center justify-center animate-pulse">
              <BookmarkIcon className="w-8 h-8 text-white/60" />
            </div>
            <div className="absolute bottom-32 right-32 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center animate-bounce" style={{animationDelay: '1s'}}>
              <TrendingUpIcon className="w-6 h-6 text-white/60" />
            </div>
            <div className="absolute top-32 left-32 w-14 h-14 bg-white/10 rounded-full flex items-center justify-center animate-pulse" style={{animationDelay: '2s'}}>
              <HeartIcon className="w-7 h-7 text-white/60" />
            </div>
          </div>

          {/* Content Container */}
          <div className="relative z-10 h-full flex items-center">
            <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
              <div className={`transition-all duration-1000 ease-out ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
              }`}>
                {/* Breadcrumb */}
                <div className="mb-6">
                  <Breadcrumb>
                    <BreadcrumbList className="text-white/90">
                      <BreadcrumbItem>
                        <BreadcrumbLink href="/" className="text-white/80 hover:text-white transition-colors duration-200">
                          Trang Chủ
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator className="text-white/60" />
                      <BreadcrumbItem>
                        <span className="text-[#00D4FF] font-semibold">Blog Y Tế</span>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
                  Blog Y Tế
                  <span className="block text-[#00D4FF] text-2xl md:text-3xl lg:text-4xl font-medium mt-1">
                    Kiến Thức Sức Khỏe
                  </span>
                </h1>

                {/* Description */}
                <p className="text-base md:text-lg text-white/90 leading-relaxed mb-6 max-w-lg">
                  Khám phá những bài viết chuyên sâu về sức khỏe, y học và lối sống khỏe mạnh từ đội ngũ chuyên gia.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-12 md:py-16 bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative max-w-2xl mx-auto">
                <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết, tác giả, chủ đề..."
                  className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-full focus:border-blue-500 focus:outline-none transition-colors duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center px-4 md:px-6 py-2 md:py-3 rounded-full transition-all duration-300 text-sm md:text-base font-medium ${
                    selectedCategory === category.id
                      ? 'bg-blue-900 !text-white shadow-lg'
                      : 'bg-blue-50 text-blue-900 hover:bg-blue-100'
                  }`}
                >
                  <TagIcon className="w-5 h-5 mr-2" />
                  <span>{category.name}</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    selectedCategory === category.id
                      ? 'bg-white/20 text-white'
                      : 'bg-blue-200 text-blue-800'
                  }`}>
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        {filteredPosts.some(post => post.featured) && (
          <section className="py-16 md:py-20 bg-gray-50">
            <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-900 mb-8 md:mb-12">
                Bài Viết Nổi Bật
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredPosts.filter(post => post.featured).map((post) => (
                  <Card key={post.id} className="group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white border-0 relative">
                    {/* Featured Badge */}
                    {/* <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold z-10">
                      ⭐ Nổi Bật
                    </div> */}
                    
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4 bg-blue-900 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {getCategoryName(post.category)}
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-blue-900 mb-3 group-hover:text-blue-700 transition-colors duration-300 line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-slate-600 text-sm line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>

                      {/* Author Info */}
                      <div className="flex items-center mb-4">
                        <img 
                          src={post.authorAvatar}
                          alt={post.author}
                          className="w-10 h-10 rounded-full object-cover mr-3"
                        />
                        <div>
                          <p className="text-sm font-semibold text-blue-900">{post.author}</p>
                          <p className="text-xs text-slate-500">{post.authorRole}</p>
                        </div>
                      </div>

                      {/* Meta Info */}
                      <div className="flex items-center justify-between mb-4 text-sm text-slate-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <CalendarIcon className="w-4 h-4 mr-1" />
                            {formatDate(post.publishDate)}
                          </div>
                          <div className="flex items-center">
                            <ClockIcon className="w-4 h-4 mr-1" />
                            {post.readTime}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center">
                            <EyeIcon className="w-4 h-4 mr-1" />
                            {formatViews(post.views)}
                          </div>
                          <div className="flex items-center">
                            <HeartIcon className="w-4 h-4 mr-1" />
                            {post.likes}
                          </div>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Button className="bg-blue-900 hover:bg-blue-800 !text-white text-sm py-2">
                          Đọc Thêm
                        </Button>
                        <Button variant="outline" className="border-blue-900 text-blue-900 hover:bg-blue-900 hover:!text-white text-sm py-2">
                          <ShareIcon className="w-4 h-4 mr-1" />
                          Chia Sẻ
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Main Content - 2 Column Layout */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              
              {/* Main Content Area */}
              <div className="lg:col-span-8">
                {/* Results Info */}
                <div className="mb-8">
                  <p className="text-lg text-slate-600">
                    Tìm thấy <span className="font-semibold text-blue-900">{filteredPosts.length}</span> bài viết
                    {selectedCategory !== "all" && (
                      <span> trong chủ đề <span className="font-semibold text-blue-900">{getCategoryName(selectedCategory)}</span></span>
                    )}
                  </p>
                </div>

                {/* Blog Posts List */}
                <div className="space-y-6">
                  {filteredPosts.map((post, index) => (
                    <Card key={post.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 bg-white border-2 border-gray-200 hover:border-gray-300 rounded-2xl relative transform hover:-translate-y-1">
                      {/* Glow effect */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-200/30 via-blue-300/20 to-blue-200/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <div className="relative flex flex-col md:flex-row bg-white rounded-2xl overflow-hidden">
                        {/* Post Image */}
                        <div className="md:w-64 lg:w-72 h-48 md:h-48 relative overflow-hidden">
                          <img 
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                          />
                          {/* Image overlay gradient */}
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-blue-800/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          
                          {/* {post.featured && (
                            <div className="absolute top-3 right-3 bg-gradient-to-r from-blue-400 to-blue-600 text-white px-3 py-1 rounded-xl text-xs font-bold shadow-md">
                              ⭐ Nổi Bật
                            </div>
                          )} */}
                          {/* Enhanced Category Badge */}
                          <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-900 to-blue-700 text-white px-3 py-1 rounded-xl text-xs font-semibold shadow-lg">
                            {getCategoryName(post.category)}
                          </div>
                          
                          {/* Reading time badge */}
                          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs">
                            <ClockIcon className="w-3 h-3 inline mr-1" />
                            {post.readTime}
                          </div>
                        </div>

                        {/* Post Content */}
                        <CardContent className="flex-1 p-5 flex flex-col justify-between relative">
                          <div className="relative z-10">
                            {/* Title */}
                            <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 bg-clip-text text-transparent mb-3 group-hover:from-blue-700 group-hover:to-blue-600 transition-all duration-300 leading-tight">
                              {post.title}
                            </h2>
                            
                            {/* Excerpt */}
                            <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-2">
                              {post.excerpt}
                            </p>
                            
                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              {post.tags.slice(0, 2).map((tag, tagIndex) => (
                                <span 
                                  key={tagIndex} 
                                  className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-3 py-1 rounded-xl text-xs font-medium hover:from-blue-200 hover:to-blue-300 transition-all duration-300 cursor-pointer"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="relative z-10">
                            {/* Author and Meta Info */}
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center">
                                <div className="relative">
                                  <img 
                                    src={post.authorAvatar}
                                    alt={post.author}
                                    className="w-8 h-8 rounded-full object-cover mr-3 ring-2 ring-gray-200 group-hover:ring-gray-300 transition-all duration-300"
                                  />
                                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border border-white"></div>
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-blue-900">{post.author}</p>
                                  <p className="text-xs text-slate-500">{post.authorRole}</p>
                                </div>
                              </div>
                              
                                                              <div className="flex items-center text-xs text-slate-500">
                                <div className="flex items-center bg-gray-50 border border-gray-200 px-2 py-1 rounded-lg">
                                  <CalendarIcon className="w-3 h-3 mr-1 text-blue-500" />
                                  {formatDate(post.publishDate)}
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-between">
                              <Button className="bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 !text-white px-5 py-2 text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                                Đọc Thêm
                              </Button>
                              
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center hover:text-blue-900 cursor-pointer transition-all duration-300 bg-blue-50 hover:bg-blue-100 border border-gray-200 hover:border-gray-300 px-2 py-1 rounded-lg">
                                  <EyeIcon className="w-3 h-3 mr-1" />
                                  <span className="text-xs font-semibold">{formatViews(post.views)}</span>
                                </div>
                                <div className="flex items-center hover:text-blue-600 cursor-pointer transition-all duration-300 bg-blue-50 hover:bg-blue-100 border border-gray-200 hover:border-gray-300 px-2 py-1 rounded-lg">
                                  <HeartIcon className="w-3 h-3 mr-1" />
                                  <span className="text-xs font-semibold">{post.likes}</span>
                                </div>
                                <button className="flex items-center hover:text-blue-700 transition-all duration-300 bg-blue-50 hover:bg-blue-100 border border-gray-200 hover:border-gray-300 p-2 rounded-lg">
                                  <ShareIcon className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* No Results */}
                {filteredPosts.length === 0 && (
                  <div className="text-center py-16">
                    <BookmarkIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-600 mb-2">Không tìm thấy bài viết</h3>
                    <p className="text-slate-500">Vui lòng thử lại với từ khóa khác hoặc thay đổi bộ lọc</p>
                    <Button 
                      onClick={() => {
                        setSelectedCategory("all");
                        setSearchTerm("");
                      }}
                      className="mt-4 bg-blue-900 hover:bg-blue-800 !text-white"
                    >
                      Đặt Lại Bộ Lọc
                    </Button>
                  </div>
                )}
              </div>

              {/* Enhanced Sidebar */}
              <div className="lg:col-span-4">
                <div className="space-y-8 sticky top-8">
                  
                  {/* Recent Posts */}
                  <Card className="border-2 border-gray-200 bg-gradient-to-br from-white to-blue-50/50 shadow-xl rounded-3xl overflow-hidden">
                    <CardContent className="p-8">
                      <div className="flex items-center mb-6">
                        <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-blue-700 rounded-full mr-4"></div>
                        <h3 className="text-xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
                          Bài Viết Gần Đây
                        </h3>
                      </div>
                      <div className="space-y-6">
                        {blogPosts.slice(0, 4).map((post, index) => (
                          <div 
                            key={`recent-${post.id}`} 
                            className="flex items-start space-x-4 group cursor-pointer p-3 rounded-2xl hover:bg-white/80 transition-all duration-300"
                            style={{
                              animationDelay: `${index * 100}ms`,
                            }}
                          >
                            <div className="relative">
                              <img 
                                src={post.image}
                                alt={post.title}
                                className="w-20 h-20 object-cover rounded-xl flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/0 to-blue-900/20 rounded-xl group-hover:from-blue-900/10 group-hover:to-blue-900/30 transition-all duration-300"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-bold text-blue-900 group-hover:text-blue-700 transition-colors line-clamp-2 leading-tight mb-2">
                                {post.title}
                              </h4>
                              <div className="flex items-center text-xs text-slate-500 bg-blue-50 border border-gray-200 px-2 py-1 rounded-full w-fit">
                                <CalendarIcon className="w-3 h-3 mr-1" />
                                {formatDate(post.publishDate)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Enhanced Categories */}
                  <Card className="border-2 border-gray-200 bg-gradient-to-br from-white to-blue-50/50 shadow-xl rounded-3xl overflow-hidden">
                    <CardContent className="p-8">
                      <div className="flex items-center mb-6">
                        <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-blue-700 rounded-full mr-4"></div>
                        <h3 className="text-xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
                          Chuyên Mục
                        </h3>
                      </div>
                      <div className="space-y-3">
                        {categories.map((category, index) => (
                          <button
                            key={`sidebar-${category.id}`}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`group w-full flex items-center justify-between py-4 px-5 rounded-2xl text-left transition-all duration-300 transform hover:scale-105 ${
                              selectedCategory === category.id
                                ? 'bg-gradient-to-r from-blue-900 to-blue-700 !text-white shadow-lg'
                                : 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 text-slate-700 hover:shadow-md'
                            }`}
                            style={{
                              animationDelay: `${index * 50}ms`,
                            }}
                          >
                            <span className="font-semibold">{category.name}</span>
                            <span className={`text-sm px-3 py-1 rounded-full font-bold ${
                              selectedCategory === category.id
                                ? 'bg-white/20 text-white'
                                : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 group-hover:from-blue-200 group-hover:to-blue-300'
                            }`}>
                              {category.count}
                            </span>
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Enhanced Popular Tags */}
                  {/* <Card className="border-0 bg-gradient-to-br from-white to-blue-50/50 shadow-xl rounded-3xl overflow-hidden">
                    <CardContent className="p-8">
                      <div className="flex items-center mb-6">
                        <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-blue-700 rounded-full mr-4"></div>
                        <h3 className="text-xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
                          Tags Phổ Biến
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {['sức khỏe', 'dinh dưỡng', 'phòng bệnh', 'tim mạch', 'yoga', 'thiền', 'AI', 'công nghệ y tế', 'giấc ngủ', 'căng thẳng', 'miễn dịch', 'khám định kỳ'].map((tag, index) => (
                          <button
                            key={index}
                            className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-blue-100 hover:to-blue-200 text-slate-700 hover:text-blue-900 px-4 py-2 rounded-2xl text-sm transition-all duration-300 font-medium hover:scale-105 hover:shadow-md"
                            style={{
                              animationDelay: `${index * 30}ms`,
                            }}
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card> */}

                  {/* Newsletter Signup Widget */}
                  {/* <Card className="border-0 bg-gradient-to-br from-blue-900 to-blue-800 shadow-2xl rounded-3xl overflow-hidden">
                    <CardContent className="p-8 text-center">
                      <div className="mb-4">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <BookmarkIcon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          Đăng Ký Newsletter
                        </h3>
                        <p className="text-white/90 text-sm">
                          Nhận thông báo bài viết mới nhất
                        </p>
                      </div>
                      <div className="space-y-3">
                        <input 
                          type="email" 
                          placeholder="Email của bạn..."
                          className="w-full px-4 py-3 rounded-2xl bg-white/20 backdrop-blur-sm text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                        />
                        <Button className="w-full bg-white text-blue-900 hover:bg-white/90 font-semibold py-3 rounded-2xl">
                          Đăng Ký
                        </Button>
                      </div>
                    </CardContent>
                  </Card> */}

                </div>
              </div>
            </div>
          </div>
        </section>

    

      

        {/* Footer */}
        <div className="relative">
          <Footer />
        </div>
      </div>
    </div>
  );
}; 