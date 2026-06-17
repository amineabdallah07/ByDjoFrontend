import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { ApiResponse, QrCode, QrCodeStats, QrOrderItem } from '../models/interfaces';

@Injectable({ providedIn: 'root' })
export class QrService {
  constructor(private api: ApiService) {}

  getQrContent(qrCode: string): Observable<ApiResponse<any>> {
    return this.api.get(`qr/${qrCode}`);
  }

  uploadPhoto(file: File): Observable<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.api.upload('qr/upload', formData);
  }

  getAllQrOrders(): Observable<ApiResponse<QrOrderItem[]>> {
    return this.api.get('qr/orders');
  }

  generateQrCodes(count: number): Observable<ApiResponse<QrCode[]>> {
    return this.api.post(`qr/codes/generate?count=${count}`, {});
  }

  getAllQrCodes(): Observable<ApiResponse<QrCode[]>> {
    return this.api.get('qr/codes');
  }

  getQrCodeStats(): Observable<ApiResponse<QrCodeStats>> {
    return this.api.get('qr/codes/stats');
  }

  deleteQrCode(id: number): Observable<ApiResponse<void>> {
    return this.api.delete(`qr/codes/${id}`);
  }
}
