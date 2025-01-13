import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = 'http://localhost:3000/comments'; // Điều chỉnh URL API của bạn
  constructor(private http: HttpClient) {}
  getComments(productId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?productId=${productId}`);
  }
  addComment(comment: any): Observable<any> {
    return this.http.post(this.apiUrl, comment);
  }
}