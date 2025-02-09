import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'; 
import { NgModule } from '@angular/core';
@Component({
  selector: 'app-popup',
  standalone: true,
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent {
  constructor(
    public dialogRef: MatDialogRef<PopupComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancel(): void {
    this.dialogRef.close('cancel'); 
  }

  onConfirm(): void {
    this.dialogRef.close('confirm'); 
  }
}
