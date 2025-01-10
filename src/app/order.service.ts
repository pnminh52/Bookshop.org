import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:3000/orders'; // URL của orders trong db.json
  private usersUrl = 'http://localhost:3000/users'; // URL của users trong db.json

  constructor(private http: HttpClient) {}

  // Hàm thêm đơn hàng
  addOrder(order: any): Observable<any> {
    const defaultOrder = {
      ...order,
      status: 'Pending', // Thêm trạng thái mặc định
    };
    return this.http.post(this.apiUrl, defaultOrder);
  }

  // Hàm cập nhật orderHistory của người dùng
  updateUserOrderHistory(userId: string, order: any): Observable<any> {
    const url = `${this.usersUrl}/${userId}`;

    // Lấy thông tin người dùng hiện tại
    return this.http.get(url).pipe(
      switchMap((user: any) => {
        // Thêm đơn hàng mới vào mảng orderHistory
        const updatedOrderHistory = user.orderHistory ? [...user.orderHistory, order] : [order];

        // Cập nhật orderHistory của người dùng
        return this.http.patch(url, { orderHistory: updatedOrderHistory });
      })
    );
  }
  // order.service.ts
  getUserOrders(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?userId=${userId}`);
  }
  // order.service.ts
  updateOrderStatus(orderId: string, newStatus: string): Observable<any> {
    const url = `${this.apiUrl}/${orderId}`;
    return this.http.patch(url, { status: newStatus });
  }
  

}