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
    return this.http.post(this.apiUrl, order);
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

}