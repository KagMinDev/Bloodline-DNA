import { FaBell } from "react-icons/fa"
import Calendar from "../components/common/Calendar"

function TestBookingManagement() {
  return (
    <div className='h-screen bg-blue-50'>
      <div className='flex h-[8%] items-center justify-between bg-white px-10'>
        <span className='text-xl font-bold text-[#1F2B6C]'>
          Quản lí lịch làm việc
        </span>
        <div className='rounded-full bg-blue-200 p-3 text-base text-[#1F2B6C]'>
          <FaBell />
        </div>
      </div>
      <div className='h-[92%]'>
        <Calendar />
      </div>
    </div>
  )
}

export default TestBookingManagement