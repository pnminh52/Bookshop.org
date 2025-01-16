import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:3000/orders'; 
  private usersUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}


  addOrder(order: any): Observable<any> {
    const defaultOrder = {
      ...order,
      status: 'Pending', 
    };
    return this.http.post(this.apiUrl, defaultOrder);
  }

  updateUserOrderHistory(userId: string, order: any): Observable<any> {
    const url = `${this.usersUrl}/${userId}`;

    return this.http.get(url).pipe(
      switchMap((user: any) => {
        const updatedOrderHistory = user.orderHistory ? [...user.orderHistory, order] : [order];

        return this.http.patch(url, { orderHistory: updatedOrderHistory });
      })
    );
  }
  getUserOrders(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?userId=${userId}`);
  }
  updateOrderStatus(orderId: string, newStatus: string): Observable<any> {
    const url = `${this.apiUrl}/${orderId}`;
    return this.http.patch(url, { status: newStatus });
  }
  

}