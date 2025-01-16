import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, CommonModule, NgIf],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user = {
    id: '',
    fullName: '',
    phoneNumber: '',
    address: {
      streetAddress: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    },
    email: '',
    password: '',
    role: 'user',
    orderHistory: [],
    avatar: 'https://i.pinimg.com/736x/18/b5/b5/18b5b599bb873285bd4def283c0d3c09.jpg' 
  };

  isEditing = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData() {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (storedUser) {
      this.user = { ...this.user, ...storedUser };
    }
  }

  startEditing() {
    this.isEditing = true;
  }

  saveChanges() {
    this.http.put(`http://localhost:3000/users/${this.user.id}`, this.user).subscribe({
      next: (response) => {
        console.log('User updated successfully:', response);
        localStorage.setItem('user', JSON.stringify(this.user));  
        this.isEditing = false;
      },
      error: (err) => {
        console.error('Error updating user:', err);
      }
    });
  }

  cancelEditing() {
    this.isEditing = false;
    this.loadUserData();  
  }
}
