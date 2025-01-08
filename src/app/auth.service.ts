import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, EMPTY } from 'rxjs';
import { throwError } from 'rxjs';
import { switchMap, map } from 'rxjs/operators'; // Thêm map vào đây

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = 'http://localhost:3000';
  http = inject(HttpClient);

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.checkLoginStatus());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  // Phương thức đăng ký
  register(data: any): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/users?email=${data.email}`).pipe(
      switchMap((existingUsers) => {
        if (existingUsers.length > 0) {
          return throwError(() => new Error('Email đã được sử dụng!'));
        } else {
          return this.http.post(`${this.apiUrl}/users`, data);
        }
      })
    );
  }

  // Phương thức đăng nhập
  login(email: string, password: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/users?email=${email}&password=${password}`).pipe(
      map(users => {
        if (users.length > 0) {
          localStorage.setItem('user', JSON.stringify(users[0])); // Lưu thông tin người dùng
          this.isLoggedInSubject.next(true); // Cập nhật trạng thái đăng nhập
        }
        return users;
      })
    );
  }

  // Kiểm tra xem người dùng có đăng nhập hay không
  private checkLoginStatus(): boolean {
    return !!localStorage.getItem('user');
  }

  // Phương thức logout
  logout(): Observable<void> {
    // Xóa thông tin người dùng trong localStorage
    localStorage.removeItem('user');
    
    // Cập nhật trạng thái đăng nhập
    this.isLoggedInSubject.next(false);

    return EMPTY; // Trả về Observable rỗng
  }
}
