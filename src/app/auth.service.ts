import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, EMPTY, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators'; 
import { CartService } from './cart.service'; 
import { Router } from '@angular/router';
import { user } from './type/Auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = 'http://localhost:3000';
  http = inject(HttpClient);

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.checkLoginStatus());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(
    private cartService: CartService, 
    private router: Router 
  ) {}
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }

  toggleUserStatus(userId: string, status: 'active' | 'inactive'): Observable<user> {
    return this.http.patch<user>(`${this.apiUrl}/users/${userId}`, { status }).pipe(
      map((updatedUser) => {
        console.log('Updated User:', updatedUser); // Kiểm tra kết quả cập nhật
        return updatedUser;
      })
    );
  }
  

  getUserInfoById(userId: string): Observable<user> {
    return this.http.get<user>(`${this.apiUrl}/users/${userId}`).pipe(
      catchError(err => {
        console.error('Error fetching user info', err);
        return throwError(() => new Error('Unable to fetch user information'));
      })
    );
  }

  register(data: any): Observable<any> {
    data.status='active'
    return this.http.get<any[]>(`${this.apiUrl}/users?email=${data.email}`).pipe(
      switchMap((existingUsers) => {
        if (existingUsers.length > 0) {
          return throwError(() => new Error('Email đã được sử dụng!'));
        } else {
          return this.http.post(`${this.apiUrl}/users`, data).pipe(
            catchError(err => {
              console.error('Error during registration', err);
              return throwError(() => new Error('Registration failed'));
            })
          );
        }
      })
    );
  }

  getUserInfo(): Observable<any> {
    const userId = this.getUserId();
    if (userId) {
      return this.http.get(`${this.apiUrl}/users/${userId}`).pipe(
        catchError(err => {
          console.error('Error fetching user info', err);
          return throwError(() => new Error('Unable to fetch user information'));
        })
      );
    } else {
      return EMPTY;
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/users?email=${email}&password=${password}`).pipe(
      map(users => {
        if (users.length > 0) {
          const user = users[0];
          if (user.status === 'inactive') {
            alert('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.');
            return [];
          }
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('userId', user.id);
          localStorage.setItem('role', user.role);
          this.isLoggedInSubject.next(true);
          this.cartService.loadCartOnLogin();
          return users;
        } else {
          return [];
        }
      }),
      catchError(err => {
        console.error('Login failed', err);
        return throwError(() => new Error('Đăng nhập thất bại'));
      })
    );
  } 

  private checkLoginStatus(): boolean {
    return !!localStorage.getItem('user');
  }

  logout(): Observable<void> {
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    this.isLoggedInSubject.next(false);
    this.cartService.clearCart();
    this.router.navigate(['/login']); 
    return EMPTY;
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }
}
