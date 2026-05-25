import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { PagedResponse } from "../models/interfaces";

@Injectable({ providedIn: "root" })
export class AdminService {
  constructor(private api: ApiService) {}

  getDashboardStats(): Observable<any> {
    return this.api.get<any>("admin/dashboard").pipe(map((r) => r.data));
  }

  getMonthlyAnalytics(months = 12): Observable<any[]> {
    return this.api
      .get<any>(`admin/analytics/monthly?months=${months}`)
      .pipe(map((r) => r.data));
  }

  getBestSellingProducts(limit = 10): Observable<any[]> {
    return this.api
      .get<any>(`admin/analytics/best-products?limit=${limit}`)
      .pipe(map((r) => r.data));
  }

  getOrderStatusStats(): Observable<any[]> {
    return this.api
      .get<any>("admin/analytics/order-status")
      .pipe(map((r) => r.data));
  }

  getCustomers(
    page = 0,
    size = 20,
    search?: string,
  ): Observable<PagedResponse<any>> {
    let url = `admin/customers?page=${page}&size=${size}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    return this.api.get<PagedResponse<any>>(url);
  }

  getCustomerDetail(id: number): Observable<any> {
    return this.api.get<any>(`admin/customers/${id}`).pipe(map((r) => r.data));
  }

  toggleCustomerActive(id: number): Observable<any> {
    return this.api.patch(`admin/customers/${id}/toggle-active`, {});
  }

  deleteCustomer(id: number): Observable<any> {
    return this.api.delete(`admin/customers/${id}`);
  }

  getInventoryAlerts(threshold = 5): Observable<any[]> {
    return this.api
      .get<any>(`admin/inventory/alerts?threshold=${threshold}`)
      .pipe(map((r) => r.data));
  }
}
