import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Order, CreateOrder, PagedResponse, OrderStatus } from '../models/interfaces';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private api: ApiService) {}

  createOrder(data: CreateOrder): Observable<Order> {
    return this.api.post('orders', data);
  }

  getMyOrders(page: number = 0, size: number = 10): Observable<PagedResponse<Order>> {
    return this.api.get(`orders/my-orders?page=${page}&size=${size}`);
  }

  getOrderById(id: number): Observable<Order> {
    return this.api.get(`orders/${id}`);
  }

  getOrderByNumber(orderNumber: string): Observable<Order> {
    return this.api.get(`orders/number/${orderNumber}`);
  }

  cancelOrder(id: number): Observable<Order> {
    return this.api.patch(`orders/${id}/cancel`, {});
  }

  // Admin
  getAllOrders(page: number = 0, size: number = 20): Observable<PagedResponse<Order>> {
    return this.api.get(`orders/admin/all?page=${page}&size=${size}`);
  }

  getOrdersByStatus(status: OrderStatus, page: number = 0, size: number = 20): Observable<PagedResponse<Order>> {
    return this.api.get(`orders/admin/status/${status}?page=${page}&size=${size}`);
  }

  searchOrders(query: string, page: number = 0, size: number = 20): Observable<PagedResponse<Order>> {
    return this.api.get(`orders/admin/search?q=${encodeURIComponent(query)}&page=${page}&size=${size}`);
  }

  updateOrderStatus(id: number, status: OrderStatus): Observable<Order> {
    return this.api.put(`orders/admin/${id}/status?status=${status}`, {});
  }

  deleteOrder(id: number): Observable<void> {
    return this.api.delete(`orders/admin/${id}`);
  }
}
