import React, { useState } from 'react';
import { BiCategory } from "react-icons/bi";
import {
  FaAngleDown,
  FaAngleRight,
  FaChartBar,
} from 'react-icons/fa';
import { TbShoppingCartCog } from "react-icons/tb";
import { Link, useLocation } from 'react-router-dom';

import logoSidebar from '../../../assets/logo.png';

interface SidebarDataType {
  icon: React.ElementType;
  heading: string;
  href: string;
  children?: SidebarDataType[];
}

const SidebarData: SidebarDataType[] = [
  {
    icon: FaChartBar,
    heading: 'Thống kê',
    href: '/staff/dashboard'
  },
  {
    icon: BiCategory,
    heading: 'Quản lí danh mục',
    href: '/staff/category',
  },
  {
    icon: TbShoppingCartCog,
    heading: 'Quản lí sản phẩm',
    href: '/staff/products'
  },
  
];

const Sidebar = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const [openDropdown, setOpenDropdown] = useState<{ [key: string]: boolean }>({});

  const toggleDropdown = (heading: string) => {
    setOpenDropdown(prev => ({
      ...prev,
      [heading]: !prev[heading]
    }));
  };

  return (
    <div className='flex h-screen w-64 flex-col bg-[#5f9ea0] shadow-lg'>
      <div className="flex flex-col items-center mb-6">
          <img
            src={logoSidebar}
            alt="AquaShop Logo"
            width={120}
            height={120}
            className="mb-2 drop-shadow-xl"
            style={{ objectFit: 'contain' }}
            draggable={false}
          />
          <h2 className="text-3xl font-bold text-white">Quản lí</h2>
        </div>
      <nav className='flex-1 px-6 py-6 overflow-y-auto scrollbar-hide'>
        <ul className='space-y-2'>
          {SidebarData.map(item => (
            <li key={item.heading}>
              {item.children ? (
                <>
                  <div
                    onClick={() => toggleDropdown(item.heading)}
                    className={`flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-sm font-medium ${
                      pathname.startsWith(item.href)
                        ? 'bg-[#EDEBDF] font-bold text-[#325343]'
                        : 'text-white hover:bg-[#EDEBDF] hover:text-[#325343]'
                    }`}
                  >
                    <div className='flex items-center'>
                      <div className='mr-3 text-lg'>
                        <item.icon />
                      </div>
                      {item.heading}
                    </div>
                    {openDropdown[item.heading] ? (
                      <FaAngleDown />
                    ) : (
                      <FaAngleRight />
                    )}
                  </div>
                  {openDropdown[item.heading] && (
                    <ul className='mt-1 ml-2 space-y-1'>
                      {item.children.map(child => (
                        <li key={child.heading}>
                          <Link to={child.href}>
                            <div
                              className={`flex cursor-pointer items-center rounded-lg px-4 py-2 text-sm font-medium ${
                                pathname === child.href
                                  ? 'bg-[#EDEBDF] font-bold text-[#325343]'
                                  : 'text-white hover:bg-[#EDEBDF] hover:text-[#325343]'
                              }`}
                            >
                              <div className='mr-3 text-lg'>
                                <child.icon />
                              </div>
                              {child.heading}
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <Link to={item.href}>
                  <div
                    className={`flex cursor-pointer items-center rounded-lg px-4 py-2 text-sm font-medium ${
                      pathname === item.href
                        ? 'bg-[#EDEBDF] font-bold text-[#325343]'
                        : 'text-white hover:bg-[#EDEBDF] hover:text-[#325343]'
                    }`}
                  >
                    <div className='mr-3 text-lg'>
                      <item.icon />
                    </div>
                    {item.heading}
                  </div>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
      
      <div className='px-4 py-6'>
        <Link to='/'>
          <button className='flex w-full items-center rounded-lg px-4 py-2 text-sm font-medium text-white hover:bg-[#EDEBDF] hover:text-[#325343]'>
            Đăng xuất
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;