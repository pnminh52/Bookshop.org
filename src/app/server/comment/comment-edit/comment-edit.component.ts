import { Component, OnInit } from '@angular/core';
import { CommentService } from 'src/app/comment.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Comment } from 'type/Comment';

@Component({
  selector: 'app-comment-edit',
  templateUrl: './comment-edit.component.html',
  styleUrls: ['./comment-edit.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CommentEditComponent implements OnInit {
  comments: any[] = []; 
  productId: string = ''; 

  constructor(
    private commentService: CommentService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id') || '';
    this.loadComments();
  }

  loadComments(): void {
    this.commentService.getComments(this.productId).subscribe((comments: any) => {
      this.comments = comments;
    });
  }

  toggleCommentVisibility(comment: any): void {
    comment.hidden = !comment.hidden;
    this.commentService.updateComment(comment.id, { hidden: comment.hidden }).subscribe({
      next: (updatedComment) => {
        console.log('Comment visibility updated:', updatedComment);
      },
      error: (err) => {
        console.error('Error updating comment visibility:', err);
      }
    });
  }
}
