import { Injectable } from '@angular/core';
import { QrData } from '../models/interfaces';

const QR_STORAGE_KEY = 'bydjo_qr_data';

@Injectable({ providedIn: 'root' })
export class StorageService {
  getQrData(): QrData[] {
    const raw = localStorage.getItem(QR_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  setQrData(items: QrData[]): void {
    localStorage.setItem(QR_STORAGE_KEY, JSON.stringify(items));
  }

  addQrData(item: QrData): void {
    const items = this.getQrData().filter(q => q.productId !== item.productId);
    items.push(item);
    this.setQrData(items);
  }

  removeQrData(productId: number): void {
    this.setQrData(this.getQrData().filter(q => q.productId !== productId));
  }

  clearQrData(): void {
    localStorage.removeItem(QR_STORAGE_KEY);
  }
}
