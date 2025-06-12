import React, { useState } from 'react';
import { FaPlus, FaEllipsisV } from 'react-icons/fa';
import { Button } from '../components/sample/ui/button';
import {Card,CardContent,CardHeader,CardTitle,} from '../components/sample/ui/card';
import {DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuTrigger,} from '../components/sample/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/sample/ui/table';

import type { SampleTest } from '../types/sampleTest';

const SampleManagement: React.FC = () => {
  const [samples, setSamples] = useState<SampleTest[]>([
    { id: 'ORD001', kitId: 'KIT001', sampleCode: 'SAMPLE001', donorName: 'Nguyen Van A', relationshipToSubject: 'Bố', sampleType: 'Máu', collectedById: 'COLLECTOR001' },
    { id: 'ORD002', kitId: 'KIT002', sampleCode: 'SAMPLE002', donorName: 'Tran Thi B', relationshipToSubject: 'Mẹ', sampleType: 'Nước tiểu', collectedById: 'COLLECTOR002' },
    { id: 'ORD003', kitId: 'KIT003', sampleCode: 'SAMPLE003', donorName: 'Le Van C', relationshipToSubject: 'Ông', sampleType: 'X-Quang', collectedById: 'COLLECTOR003' },
    { id: 'ORD004', kitId: 'KIT004', sampleCode: 'SAMPLE004', donorName: 'Le Van C', relationshipToSubject: 'Bà', sampleType: 'X-Quang', collectedById: 'COLLECTOR004' },
    { id: 'ORD005', kitId: 'KIT005', sampleCode: 'SAMPLE005', donorName: 'Le Van C', relationshipToSubject: 'Cháu', sampleType: 'X-Quang', collectedById: 'COLLECTOR005' },
    { id: 'ORD006', kitId: 'KIT006', sampleCode: 'SAMPLE006', donorName: 'Le Van C', relationshipToSubject: 'Cháu', sampleType: 'X-Quang', collectedById: 'COLLECTOR006' },
  ]);

  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Quản lý mẫu xét nghiệm</h1>
        <Button
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          onClick={() => alert('Chức năng thêm mẫu sẽ được triển khai sau.')}
        >
          <FaPlus className="text-white" />
          Thêm mẫu
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-blue-600">Danh sách mẫu xét nghiệm</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã đơn</TableHead>
                <TableHead>Mã kit</TableHead>
                <TableHead>Mã mẫu</TableHead>
                <TableHead>Người cho mẫu</TableHead>
                <TableHead>Quan hệ</TableHead>
                <TableHead>Loại mẫu</TableHead>
                <TableHead>Người thu mẫu</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {samples.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-gray-400 py-6">
                    Chưa có mẫu xét nghiệm nào.
                  </TableCell>
                </TableRow>
              ) : (
                samples.map(sample => (
                  <TableRow key={sample.id}>
                    <TableCell className="font-medium text-blue-700">{sample.id}</TableCell>
                    <TableCell>{sample.kitId}</TableCell>
                    <TableCell>{sample.sampleCode}</TableCell>
                    <TableCell>{sample.donorName}</TableCell>
                    <TableCell>{sample.relationshipToSubject}</TableCell>
                    <TableCell>{sample.sampleType}</TableCell>
                    <TableCell>{sample.collectedById}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <FaEllipsisV className="text-blue-600" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => alert('Chức năng sửa sẽ bổ sung sau')}>
                            Sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => alert('Chức năng xóa sẽ bổ sung sau')}
                            className="text-red-600 focus:bg-red-50 focus:text-red-800"
                          >
                            Xóa
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
};

export default SampleManagement;
