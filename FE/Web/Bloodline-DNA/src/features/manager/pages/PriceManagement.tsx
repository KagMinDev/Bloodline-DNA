import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../staff/components/sample/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../staff/components/sample/ui/dropdown-menu';
import { Button } from '../../staff/components/sample/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../staff/components/sample/ui/table';
import { Badge } from '../../staff/components/booking/ui/badge';


type PriceItem = {
  id: string;
  serviceId: string;
  price: number;
  collectionMethod: number;
  currency: string;
  effectiveFrom: string;
  effectiveTo: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  testServiceInfor: string;
};

const mockPrices: PriceItem[] = [
  {
    id: '1',
    serviceId: 'S001',
    price: 1200000,
    collectionMethod: 0,
    currency: 'VND',
    effectiveFrom: '2025-06-01T00:00:00.000Z',
    effectiveTo: '2025-12-31T00:00:00.000Z',
    isActive: true,
    createdAt: '2025-06-01T00:00:00.000Z',
    updatedAt: '2025-06-01T00:00:00.000Z',
    testServiceInfor: 'Xét nghiệm ADN cơ bản',
  },
  {
    id: '2',
    serviceId: 'S002',
    price: 1800000,
    collectionMethod: 0,
    currency: 'VND',
    effectiveFrom: '2025-06-01T00:00:00.000Z',
    effectiveTo: '2025-12-31T00:00:00.000Z',
    isActive: false,
    createdAt: '2025-06-01T00:00:00.000Z',
    updatedAt: '2025-06-01T00:00:00.000Z',
    testServiceInfor: 'Xét nghiệm huyết thống cha - con',
  },
];

export default function PriceManagement() {
  const [prices, setPrices] = useState<PriceItem[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setPrices(mockPrices);
    }, 300);
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-blue-700">Quản lý giá dịch vụ</h1>
        <Button className="flex items-center gap-2 bg-[#1F2B6C] hover:bg-blue-800">
          <Plus size={24} className='text-white '/>
          <span className='text-white'>Thêm dịch vụ</span>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-blue-700">Danh sách giá dịch vụ</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Dịch vụ</TableHead>
                <TableHead className="text-center">Giá</TableHead>
                <TableHead className="text-center">Thu</TableHead>
                <TableHead className="text-center">Hiệu lực</TableHead>
                <TableHead className="text-center">Trạng thái</TableHead>
                <TableHead className="text-center">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-400 py-6">
                    Không có dữ liệu giá dịch vụ.
                  </TableCell>
                </TableRow>
              ) : (
                prices.map((price) => (
                  <TableRow key={price.id}>
                    <TableCell className="text-center font-medium text-blue-900">{price.testServiceInfor}</TableCell>
                    <TableCell className="text-center">
                      <span className="font-semibold text-green-700">
                        {price.price.toLocaleString()} {price.currency}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                        {price.collectionMethod === 0 ? 'Trực tiếp' : 'Khác'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="block text-sm text-gray-700">
                        {new Date(price.effectiveFrom).toLocaleDateString()} - {new Date(price.effectiveTo).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell className='text-center'>
                      <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${price.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'}`}>
                        {price.isActive ? 'Hoạt động' : 'Tạm ngưng'}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                              <circle cx="12" cy="5" r="1.5" fill="#2563eb" />
                              <circle cx="12" cy="12" r="1.5" fill="#2563eb" />
                              <circle cx="12" cy="19" r="1.5" fill="#2563eb" />
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => alert('Chức năng sửa sẽ bổ sung sau')}>
                            <Pencil size={16} className="mr-2" /> Sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => alert('Chức năng xóa sẽ bổ sung sau')}
                            className="text-red-600 focus:bg-red-50 focus:text-red-800"
                          >
                            <Trash2 size={16} className="mr-2" /> Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
