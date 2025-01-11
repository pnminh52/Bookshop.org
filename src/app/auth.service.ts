import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, EMPTY } from 'rxjs';
import { throwError } from 'rxjs';
import { switchMap, map } from 'rxjs/operators'; 
import { CartService } from './cart.service'; 
import { Router } from '@angular/router';

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


  login(email: string, password: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/users?email=${email}&password=${password}`).pipe(
      map(users => {
        if (users.length > 0) {
          const user = users[0];
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('userId', user.id);
          this.isLoggedInSubject.next(true); 
          this.cartService.loadCartOnLogin(); 
        }
        return users;
      })
    );
  }


  private checkLoginStatus(): boolean {
    return !!localStorage.getItem('user');
  }

  logout(): Observable<void> {
    localStorage.removeItem('user'); 
    localStorage.removeItem('userId');
    this.isLoggedInSubject.next(false); 
    this.cartService.clearCart(); 
    this.router.navigate(['/']); 
    alert('Đăng xuất thành công!');
    return EMPTY; 
  }
  
}
