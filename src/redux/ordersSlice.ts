import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order } from '../types';

interface OrdersState {
  orders: Order[];
}

// Hàm tải đơn hàng từ localStorage
const loadOrdersFromLocalStorage = (): Order[] => {
  try {
    const storedOrders = localStorage.getItem('orders');
    console.log('Stored orders:', storedOrders); // Kiểm tra giá trị lấy từ localStorage

    if (storedOrders) {
      const parsedOrders: Order[] = JSON.parse(storedOrders);

      // Xử lý ngày giờ của từng đơn hàng
      parsedOrders.forEach((order: Order) => {
        if (order.date) {
          const parsedDate = new Date(order.date);
          // Kiểm tra tính hợp lệ của ngày
          if (isNaN(parsedDate.getTime())) {
            console.error('Invalid date in order:', order.date);
            order.date = ''; // Nếu ngày không hợp lệ, loại bỏ trường date
          } else {
            order.date = parsedDate.toISOString(); // Chuyển đổi thành ISO string nếu hợp lệ
          }
        }
        // Lưu thời gian lưu vào trường `savedAt`
        if (order.savedAt) {
          const parsedSavedAt = new Date(order.savedAt);
          if (isNaN(parsedSavedAt.getTime())) {
            console.error('Invalid savedAt in order:', order.savedAt);
            order.savedAt = '';
          } else {
            order.savedAt = parsedSavedAt.toISOString();
          }
        }
      });

      return parsedOrders;
    }
    return [];
  } catch (e) {
    console.warn('Không thể lấy từ localStorage', e);
    return [];
  }
};

// Hàm lưu đơn hàng vào localStorage
const saveOrdersToLocalStorage = (orders: Order[]) => {
  try {
    console.log('Saving orders:', orders); // Kiểm tra đơn hàng sẽ lưu vào localStorage
    localStorage.setItem('orders', JSON.stringify(orders));
  } catch (e) {
    console.warn('Không thể lưu vào localStorage', e);
  }
};

const initialState: OrdersState = {
  orders: loadOrdersFromLocalStorage(),
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrder: (state, action: PayloadAction<Order>) => {
      const newOrder = {
        ...action.payload,
        orderDate: new Date().toISOString(), // Lưu thời gian hiện tại khi thêm đơn hàng
        savedAt: new Date().toISOString(), // Lưu thời gian lưu vào localStorage
      };
      state.orders.push(newOrder);
      saveOrdersToLocalStorage(state.orders); // Lưu đơn hàng mới vào localStorage
    },
    removeOrder: (state, action: PayloadAction<number>) => {
      state.orders = state.orders.filter((_, index) => index !== action.payload);
      saveOrdersToLocalStorage(state.orders);
    },
  },
});

export const { addOrder, removeOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
