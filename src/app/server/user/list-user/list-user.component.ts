import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth.service';
import { user } from '../../../type/Auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-user',
  standalone:true,
  imports:[CommonModule],
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent implements OnInit {
  users: user[] = [];
  loading = false;
  error: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.authService.getUsers().subscribe(
      (users) => {
        console.log('Users:', users); 
        this.users = users;
        this.loading = false;
      },
      (error) => {
        console.error('Error loading users', error);
        this.loading = false;
      }
    );
  }
  

  toggleStatus(userId: string, status: 'active' | 'inactive'): void {
    this.authService.toggleUserStatus(userId, status).subscribe(
      (updatedUser) => {
        const index = this.users.findIndex((user) => user.id === userId);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
      },
      (error) => {
        console.error('Không thể cập nhật trạng thái người dùng', error);
      }
    );
  }
  
}
