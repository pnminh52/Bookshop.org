import { Component, OnInit } from '@angular/core';
import { CommentService } from 'src/app/comment.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-comment-list',
  standalone: true,
  imports:[CommonModule, FormsModule, RouterLink],
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.css']
})
export class CommentListComponent implements OnInit {
  productsWithComments: any[] = [];  // Danh sách sản phẩm có comment

  constructor(private commentService: CommentService) {}

  ngOnInit(): void {
    this.fetchProductsWithComments();
  }

  // Lấy tất cả sản phẩm có comment
  fetchProductsWithComments(): void {
    this.commentService.getProductsWithComments().subscribe((products: any) => {
      this.productsWithComments = products.filter((product: any) => product.comments.length > 0);
    });
  }
}
