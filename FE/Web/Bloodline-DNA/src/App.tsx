import { message } from 'antd';
import React from 'react';
import AppRouters from './Router/AppRouter';

message.config({
  top: 80,         // Cách top 80px (để tránh đè lên header nếu có)
  duration: 3,     // Tự động đóng sau 3 giây
  maxCount: 3,     // Tối đa 3 message cùng lúc
});

const App: React.FC = () => {
  return (
    <div className="App">
      <AppRouters />
    </div>
  );
}

export default App;
