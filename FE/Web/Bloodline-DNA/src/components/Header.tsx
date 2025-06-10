import { Button } from "antd";
import { Dna } from "lucide-react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 shadow-sm bg-white/90 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full">
            <Dna size={24} className="text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-800">ADN Huyết Thống</span>
        </div>

        {/* Navigation */}
        <nav className="hidden space-x-8 md:flex">
        <a href="/" className="text-gray-600 transition-colors hover:text-blue-600">
            Trang chủ
          </a>
          <a href="/about" className="text-gray-600 transition-colors hover:text-blue-600">
            Về chúng tôi
          </a>
          <a href="/services" className="text-gray-600 transition-colors hover:text-blue-600">
            Dịch vụ
          </a>
          <a href="/doctors" className="text-gray-600 transition-colors hover:text-blue-600">
            Các Bác Sĩ
          </a>
          <a href="/blogs" className="text-gray-600 transition-colors hover:text-blue-600">
            Tin tức
          </a>
          <a href="/contacts" className="text-gray-600 transition-colors hover:text-blue-600">
            Liên hệ
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <Link
            to="/login"
            className="font-semibold text-blue-600 transition-colors hover:text-blue-800"
          >
            Đăng nhập
          </Link>
          <Link to="/register">
            <Button
              type="primary"
              size="large"
              className="transition-all bg-blue-600 border-none shadow-lg hover:bg-blue-700 hover:shadow-xl"
            >
              Đăng ký ngay
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;