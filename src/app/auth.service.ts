import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = 'http://localhost:3000';
  http = inject(HttpClient);

  // Phương thức đăng ký
  register(data: any): Observable<any> {
    // Kiểm tra xem email đã tồn tại trong hệ thống chưa
    return this.http.get<any[]>(`${this.apiUrl}/users?email=${data.email}`).pipe(
      switchMap((existingUsers) => {
        if (existingUsers.length > 0) {
          // Nếu email đã tồn tại, trả về một observable lỗi
          return throwError(() => new Error('Email đã được sử dụng!'));
        } else {
          // Nếu chưa, thực hiện đăng ký người dùng mới
          return this.http.post(`${this.apiUrl}/users`, data);
        }
      })
    );
  }
  // Phương thức đăng nhập
  login(email: string, password: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users?email=${email}&password=${password}`);
  }
}