import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Product } from '../models/interfaces';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  constructor(private api: ApiService) {}

  getWishlist(): Observable<Product[]> {
    return this.api.get('wishlist');
  }

  addToWishlist(productId: number): Observable<any> {
    return this.api.post(`wishlist/${productId}`, {});
  }

  removeFromWishlist(productId: number): Observable<any> {
    return this.api.delete(`wishlist/${productId}`);
  }

  isInWishlist(productId: number): Observable<boolean> {
    return this.api.get(`wishlist/check/${productId}`);
  }
}
