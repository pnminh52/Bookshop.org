import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = 'http://localhost:3000'; // URL của backend
  http = inject(HttpClient);

  // Phương thức đăng ký
  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  // Phương thức đăng nhập
  login(email: string, password: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users?email=${email}&password=${password}`);
  }
}