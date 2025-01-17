import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/app/order.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css'
})
export class OrderDetailComponent implements OnInit {
  order: any;
  selectedStatus: string='Pending';

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.orderService.getOrderById(orderId).subscribe((order) => {
        this.order = order;
        this.selectedStatus = order.status; 
      });
    }
  }

  updateOrderStatus(): void {
    if (this.order.status === 'Cancelled') {
      alert('This order has already been cancelled and cannot be updated.');
      return;
    }
    this.orderService.updateOrderStatus(this.order.id, this.selectedStatus).subscribe(
      (updatedOrder) => {
        this.order = updatedOrder; 
        alert('Order status updated successfully!');
      },
      (error) => {
        console.error('Error updating order status:', error);
      }
    );
  }
}
