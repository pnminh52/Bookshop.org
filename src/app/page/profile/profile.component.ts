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
    id: 'b53c',
    fullName: 'Phạm Nhật Minh',
    phoneNumber: '0934557882',
    address: {
      streetAddress: 'Hà Nam',
      city: 'Ha Noi',
      state: 'California',
      postalCode: '989898',
      country: 'Việt Nam'
    },
    email: '2@gmail.com',
    password: '111111',
    role: 'user',
    orderHistory: [],
    avatar: 'path_to_avatar_image'  // Initially set to a placeholder or default URL
  };

  isEditing = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData() {
    // Assuming you fetch the user data from a backend or localStorage
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (storedUser) {
      this.user = { ...this.user, ...storedUser };
    }
  }

  startEditing() {
    this.isEditing = true;
  }

  saveChanges() {
    // Update the user data on the backend (db.json in this case)
    this.http.put(`http://localhost:3000/users/${this.user.id}`, this.user).subscribe({
      next: (response) => {
        console.log('User updated successfully:', response);
        localStorage.setItem('user', JSON.stringify(this.user));  // Save the updated data locally
        this.isEditing = false;
      },
      error: (err) => {
        console.error('Error updating user:', err);
      }
    });
  }

  cancelEditing() {
    this.isEditing = false;
    this.loadUserData();  // Reset the form to the original data
  }
}
