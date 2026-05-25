import { Injectable, signal, computed } from "@angular/core";
import { ApiService } from "./api.service";
import { Cart, AddToCart } from "../models/interfaces";
import { Observable, tap } from "rxjs";

@Injectable({ providedIn: "root" })
export class CartService {
  private cartSubject = signal<Cart | null>(null);
  public cart = computed(() => this.cartSubject());
  public itemCount = computed(() => this.cartSubject()?.itemCount ?? 0);
  public total = computed(() => this.cartSubject()?.total ?? 0);

  constructor(private api: ApiService) {
    this.ensureSessionId();
    this.loadCart();
  }

  private ensureSessionId(): void {
    if (!localStorage.getItem("cart_session_id")) {
      const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        (c) => {
          const r = (Math.random() * 16) | 0;
          return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
        },
      );
      localStorage.setItem("cart_session_id", uuid);
    }
  }

  private getSessionId(): string {
    return localStorage.getItem("cart_session_id") || "";
  }

  loadCart(): void {
    const url = `cart?sessionId=${this.getSessionId()}`;
    this.api.get<Cart>(url).subscribe({
      next: (cart) => this.cartSubject.set(cart),
      error: () => this.cartSubject.set(null),
    });
  }

  addToCart(item: AddToCart): Observable<Cart> {
    return this.api
      .post<Cart>(`cart/items?sessionId=${this.getSessionId()}`, item)
      .pipe(tap((cart) => this.cartSubject.set(cart)));
  }

  updateCartItem(itemId: number, quantity: number): Observable<Cart> {
    return this.api
      .put<Cart>(
        `cart/items/${itemId}?sessionId=${this.getSessionId()}&quantity=${quantity}`,
        {},
      )
      .pipe(tap((cart) => this.cartSubject.set(cart)));
  }

  removeFromCart(itemId: number): Observable<Cart> {
    return this.api
      .delete<Cart>(`cart/items/${itemId}?sessionId=${this.getSessionId()}`)
      .pipe(tap((cart) => this.cartSubject.set(cart)));
  }

  clearCart(): Observable<any> {
    return this.api
      .delete(`cart?sessionId=${this.getSessionId()}`)
      .pipe(tap(() => this.cartSubject.set(null)));
  }

  applyCoupon(code: string): Observable<Cart> {
    return this.api
      .post<Cart>(
        `cart/coupon?sessionId=${this.getSessionId()}&code=${code}`,
        {},
      )
      .pipe(tap((cart) => this.cartSubject.set(cart)));
  }

  removeCoupon(): Observable<Cart> {
    return this.api
      .delete<Cart>(`cart/coupon?sessionId=${this.getSessionId()}`)
      .pipe(tap((cart) => this.cartSubject.set(cart)));
  }

  formatPrice(amount: number): string {
    return amount.toFixed(3) + " TND";
  }
}
