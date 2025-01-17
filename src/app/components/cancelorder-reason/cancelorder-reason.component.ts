import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cancelorder-reason',
  standalone: true,
  imports:[CommonModule, FormsModule],
  templateUrl: './cancelorder-reason.component.html',
  styleUrls: ['./cancelorder-reason.component.css']
})
export class CancelorderReasonComponent {
  reasons: string[] = ['Không cần nữa', 'Sai thông tin', 'Khác']; 
  selectedReason: string | null = null;

  constructor(private dialogRef: MatDialogRef<CancelorderReasonComponent>) {}

  closeDialog() {
    this.dialogRef.close();
  }

  confirm() {
    this.dialogRef.close(this.selectedReason);
  }
}
