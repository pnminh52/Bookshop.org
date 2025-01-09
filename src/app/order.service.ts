import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:3000/orders'; // URL của db.json

  constructor(private http: HttpClient) {}

  // Hàm thêm đơn hàng
  addOrder(order: any): Observable<any> {
    return this.http.post(this.apiUrl, order);
  }
}