import React, { useState } from 'react';
import { FaPlus, FaEllipsisV } from 'react-icons/fa';
import { Button } from '../components/sample/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/sample/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/sample/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/sample/ui/table';
import type { SampleTestRequest } from '../types/sampleTest';
import ModalSample from '../components/testSample/ModalSample';

const TestSample: React.FC = () => {
  const [samples, setSamples] = useState<any[]>([/* Sample dữ liệu đã có */]);
  const [openModal, setOpenModal] = useState(false);

  const [form, setForm] = useState<SampleTestRequest>({
    sampleType: 0,
    instructionText: '',
    mediaUrl: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'sampleType' ? Number(value) : value }));
  };

  const handleSubmit = () => {
    console.log('Dữ liệu mẫu mới:', form);
    setSamples(prev => [...prev, { ...form, id: `ORD${prev.length + 1}` }]);
    setOpenModal(false);
    setForm({ sampleType: 0, instructionText: '', mediaUrl: '' });
  };

  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Quản lý mẫu xét nghiệm</h1>
        <Button
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          onClick={() => setOpenModal(true)}
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
                <TableHead>Loại mẫu</TableHead>
                <TableHead>Hướng dẫn</TableHead>
                <TableHead>Media URL</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {samples.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-400 py-6">
                    Chưa có mẫu xét nghiệm nào.
                  </TableCell>
                </TableRow>
              ) : (
                samples.map((sample, index) => (
                  <TableRow key={index}>
                    <TableCell>{sample.id}</TableCell>
                    <TableCell>{sample.sampleType}</TableCell>
                    <TableCell>{sample.instructionText}</TableCell>
                    <TableCell>
                      <a href={sample.mediaUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Xem media
                      </a>
                    </TableCell>
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

      {/* Modal Thêm Mẫu */}
      <ModalSample
        open={openModal}
        onClose={() => setOpenModal(false)}
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default TestSample;