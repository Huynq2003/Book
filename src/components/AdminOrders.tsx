import React, { useEffect, useState } from 'react';

interface UserInfo {
  name: string;
  email: string;
  address: string;
  phone: string;
}

interface OrderItem {
  id: number;
  image: string;
  title: string;
  author: string;
  price: number;
  quantity: number;
}

interface OrderInfo {
  userInfo: UserInfo;
  paymentMethod: string;
  selectedBank?: string;
  selectedItems: OrderItem[];
  formattedTotalAmount: number;
  date: string; // Ensure this is an ISO 8601 string or correctly formatted 
  canceled?: boolean;
  approvedAt?: string; // Thêm trường để lưu thời gian duyệt đơn
}

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<OrderInfo[]>([]);

  useEffect(() => {
    const savedOrders = localStorage.getItem('orderInfo');
    if (savedOrders) {
      const allOrders = [JSON.parse(savedOrders)];
      setOrders(allOrders.filter(order => !order.canceled)); 
    }
  }, []);

  const cancelOrder = (index: number) => {
    const updatedOrders = [...orders];
    updatedOrders[index].canceled = true; // Đánh dấu đơn hàng là đã hủy
    setOrders(updatedOrders);
    localStorage.setItem('orderInfo', JSON.stringify(updatedOrders)); // Cập nhật localStorage
  };

  const approveOrder = (index: number) => {
    const updatedOrders = [...orders];
    const approvalTime = new Date().toLocaleString('vi-VN'); // Lấy thời gian hiện tại
    updatedOrders[index].approvedAt = approvalTime; // Cập nhật thời gian duyệt đơn
    setOrders(updatedOrders);
    localStorage.setItem('orderInfo', JSON.stringify(updatedOrders)); // Cập nhật localStorage
  };

  // Attempt to parse the date
  let date: Date;
  try {
    date = new Date(orders.date);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid Date');
    }
  } catch (error) {
    console.error('Error parsing order date:', error);
    date = new Date(); // Fallback to current date
  } 
  const formatDate = date.toLocaleDateString('vi-VN');
  const formatTime = date.toLocaleTimeString('vi-VN');

  if (orders.length === 0) {
    return <p>Không có thông tin đơn hàng.</p>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
    <h1 className="text-3xl font-bold mb-6 text-gray-800">Danh Sách Đơn Hàng</h1>
    <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
      <thead className="bg-gray-200 text-gray-700">
        <tr>
          <th className="px-4 py-2 text-left text-sm font-semibold">Tên Người Đặt Hàng</th>
          <th className="px-4 py-2 text-left text-sm font-semibold">Tên Sản Phẩm</th>
          <th className="px-4 py-2 text-left text-sm font-semibold">Số Tiền</th>
          <th className="px-4 py-2 text-left text-sm font-semibold">Địa Chỉ</th>
          <th className="px-4 py-2 text-left text-sm font-semibold">Số Điện Thoại</th>
          <th className="px-4 py-2 text-left text-sm font-semibold">Ngày Đặt Hàng</th>
          <th className="px-4 py-2 text-left text-sm font-semibold">Trạng Thái</th>
          <th className="px-4 py-2 text-center text-sm font-semibold">Duyệt Đơn</th>
          <th className="px-4 py-2 text-center text-sm font-semibold">Hành Động</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-300">
        {orders.map((order, index) => (
          <tr key={index} className="hover:bg-gray-100">
            <td className="px-4 py-3 text-gray-800">{order.userInfo.name}</td>
            <td className="px-4 py-3">
              {order.selectedItems.map((item) => (
                <div key={item.id} className="text-gray-700">
                  <p>{item.title} (x{item.quantity})</p>
                </div>
              ))}
            </td>
            <td className="px-4 py-3 text-gray-800">
              {order.selectedItems.reduce((total, item) => total + item.price * item.quantity, 0)}.000 VND
            </td>
            <td className="px-4 py-3 text-gray-700">{order.userInfo.address}</td>
            <td className="px-4 py-3 text-gray-700">{order.userInfo.phone}</td>
            <td className="px-4 py-3 text-gray-700">{formatDate} {formatTime}</td>
            <td className="px-4 py-3 text-gray-700">
              {order.canceled ? (
                <span className="text-red-600">Đã hủy</span>
              ) : (
                <span className="text-green-600">Đã đặt hàng</span>
              )}
            </td>
            <td className="px-4 py-3 text-center">
              {!order.canceled && !order.approvedAt ? (
                <button
                  onClick={() => approveOrder(index)}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Duyệt
                </button>
              ) : (
                order.approvedAt && <p className="text-sm text-gray-500">Duyệt lúc: {order.approvedAt}</p>
              )}
            </td>
            <td className="px-4 py-3 text-center">
              {!order.canceled && !order.approvedAt && (
                <button
                  onClick={() => cancelOrder(index)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Hủy
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  
  );
};

export default AdminOrders;
