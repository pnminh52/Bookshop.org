import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../product.service';
import { Product } from '../../type/Products';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  products: Product[] = []; // Mảng để lưu trữ danh sách sản phẩm
  limitedProducts: Product[] = [];
  novelCategory: Product[] = []; // Khai báo thuộc tính novelCategory
  
  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts(); // Gọi hàm để lấy dữ liệu khi component được khởi tạo
  }

  loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data;
        this.limitedProducts = this.products.slice(0, 4); // Lấy 4 sản phẩm đầu tiên
        this.filterNovelCategory(); // Lọc sản phẩm theo thể loại "Tiểu thuyết"
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      }
    });
  }

  // Hàm lọc các sản phẩm có thể loại "Tiểu thuyết"
  filterNovelCategory(): void {
    // Nếu product.category là một đối tượng Category, truy cập vào thuộc tính name
    this.novelCategory = this.products.filter(product => product.category === 'Tiểu thuyết');
  }
  
}
