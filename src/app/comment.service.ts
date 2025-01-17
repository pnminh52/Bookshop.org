import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = 'http://localhost:3000/comments'; 
  private productsUrl = 'http://localhost:3000/products'
  constructor(private http: HttpClient) {}
  getComments(productId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?productId=${productId}`);
  }
  addComment(comment: any): Observable<any> {
    return this.http.post(this.apiUrl, comment);
  }
  getProductsWithComments(): Observable<any>{
    return this.http.get(`${this.productsUrl}?_embed=comments`);
  }
  getAllComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}`);
  }
  updateComment(comment: any):Observable<any>{
    return this.http.put(`${this.apiUrl}/${comment.id}`, comment);
  }
}