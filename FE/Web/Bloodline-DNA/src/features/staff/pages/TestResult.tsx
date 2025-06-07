import { useState } from 'react';
import type { TestResult as TestResultType } from '../types/testResult';
import ModalTestResult from '../components/common/ModalTestResult';

const initialResults: TestResultType[] = [
	{
		id: 'RES001',
		testBookingId: 'BOOK001',
		resultSummary: 'Âm tính với các chỉ số bất thường.',
		resultDate: new Date('2024-06-01'),
		resultFileUrl: 'https://example.com/result1.pdf',
	},
	{
		id: 'RES002',
		testBookingId: 'BOOK002',
		resultSummary: 'Phát hiện chỉ số cao, cần theo dõi thêm.',
		resultDate: new Date('2024-06-02'),
		resultFileUrl: 'https://example.com/result2.pdf',
	},
];

function TestResult() {
	const [results, setResults] = useState<TestResultType[]>(initialResults);
	const [showModal, setShowModal] = useState(false);
	const [editIndex, setEditIndex] = useState<number | null>(null);
	const [form, setForm] = useState<Omit<TestResultType, 'resultDate'> & { resultDate: string }>({
		id: '',
		testBookingId: '',
		resultSummary: '',
		resultDate: '',
		resultFileUrl: '',
	});

	const openCreateModal = () => {
		setEditIndex(null);
		setForm({
			id: '',
			testBookingId: '',
			resultSummary: '',
			resultDate: '',
			resultFileUrl: '',
		});
		setShowModal(true);
	};

	const openEditModal = (idx: number) => {
		const r = results[idx];
		setEditIndex(idx);
		setForm({
			...r,
			resultDate: r.resultDate ? new Date(r.resultDate).toISOString().slice(0, 10) : '',
		});
		setShowModal(true);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const newResult: TestResultType = {
			...form,
			resultDate: new Date(form.resultDate),
		};
		if (editIndex === null) {
			setResults([...results, newResult]);
		} else {
			setResults(results.map((r, idx) => (idx === editIndex ? newResult : r)));
		}
		setShowModal(false);
	};

	return (
		<div className="min-h-screen bg-blue-50 p-8">
			<div className="max-w-7xl mx-auto">
				<h1 className="text-3xl font-bold text-blue-600 mb-8">Kết quả xét nghiệm</h1>
				<div className="flex justify-end mb-4">
					<button
						className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
						onClick={openCreateModal}
					>
						+ Tạo kết quả mới
					</button>
				</div>
				<div className="bg-white rounded-xl shadow-lg p-6 border border-blue-200">
					<div className="overflow-x-auto">
						<table className="min-w-full table-fixed border border-blue-200 text-sm">
							<thead>
								<tr className="bg-blue-100 text-blue-700">
									<th className="py-3 px-4 border-b font-bold w-1/6">Mã kết quả</th>
									<th className="py-3 px-4 border-b font-bold w-1/6">Mã đặt xét nghiệm</th>
									<th className="py-3 px-4 border-b font-bold w-2/6">Tóm tắt kết quả</th>
									<th className="py-3 px-4 border-b font-bold w-1/6">Ngày trả kết quả</th>
									<th className="py-3 px-4 border-b font-bold w-1/6">File kết quả</th>
									<th className="py-3 px-4 border-b font-bold w-1/6">Hành động</th>
								</tr>
							</thead>
							<tbody>
								{results.length === 0 ? (
									<tr>
										<td colSpan={6} className="text-center text-gray-400 py-6">
											Chưa có kết quả xét nghiệm nào.
										</td>
									</tr>
								) : (
									results.map((result, idx) => (
										<tr key={result.id} className="hover:bg-blue-50 transition">
											<td className="py-3 px-4 border-b text-blue-700 font-medium break-words text-center">
												{result.id}
											</td>
											<td className="py-3 px-4 border-b break-words text-center">
												{result.testBookingId}
											</td>
											<td className="py-3 px-4 border-b break-words text-center">
												{result.resultSummary}
											</td>
											<td className="py-3 px-4 border-b break-words text-center">
												{new Date(result.resultDate).toLocaleDateString('vi-VN')}
											</td>
											<td className="py-3 px-4 border-b break-words text-center">
												<a
													href={result.resultFileUrl}
													target="_blank"
													rel="noopener noreferrer"
													className="text-blue-600 hover:underline"
												>
													Xem file
												</a>
											</td>
											<td className="py-3 px-4 border-b text-center">
												<button
													className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 transition mr-2"
													onClick={() => openEditModal(idx)}
												>
													Sửa
												</button>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</div>

				<ModalTestResult
					show={showModal}
					onClose={() => setShowModal(false)}
					onSubmit={handleSubmit}
					form={form}
					onChange={handleChange}
					editIndex={editIndex}
				/>
			</div>
		</div>
	);
}

export default TestResult;