import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Product } from './type/Products';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

 apiUrl= 'http://localhost:3000/products'
 http = inject(HttpClient);
 getAll (){
  return this.http.get<Product[]>(this.apiUrl);
 }
 getDetali (id:string){
  return this.http.get<Product[]>(`${this.apiUrl}/${id}`);
 }
 addProduct (data:any){
  return this.http.post(this.apiUrl,data);
 }
 edit (id:string,data:any){
  return this.http.put(`${this.apiUrl}/${id}`,data);
 }
 delete (id:string){
  return this.http.delete(`${this.apiUrl}/${id}`);
 }
 getProductById(id: string): Observable<Product> {
  return this.http.get<Product>(`${this.apiUrl}/${id}`);
}
}
