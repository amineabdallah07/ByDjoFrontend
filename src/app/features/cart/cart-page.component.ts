import { Component, inject, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { CartService } from "../../core/services/cart.service";
import { I18nService } from "../../core/services/i18n.service";
import { Cart } from "../../core/models/interfaces";

@Component({
  selector: "app-cart",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="pt-24 pb-20">
      <div class="page-container">
        <h1 class="text-4xl font-black text-dark-100 mb-8">MON PANIER</h1>

        @if (cartData() && cartData()!.items.length > 0) {
          <div class="grid lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 space-y-4">
              @for (item of cartData()!.items; track item.id) {
                <div
                  class="glass rounded-2xl p-4 md:p-6 flex gap-4 md:gap-6 animate-fade-in"
                >
                  <div
                    class="w-20 h-24 md:w-28 md:h-36 bg-dark-800 rounded-xl shrink-0 overflow-hidden"
                  >
                    @if (item.productImage) {
                      <img
                        [src]="getImageUrl(item.productImage)"
                        [alt]="item.productName"
                        class="w-full h-full object-cover"
                        (error)="onImageError($event)"
                      />
                    } @else {
                      <div
                        class="w-full h-full flex items-center justify-center text-dark-600"
                      >
                        <svg
                          class="w-10 h-10"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="1"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    }
                  </div>
                  <div class="flex-1 min-w-0">
                    <a
                      [routerLink]="['/product', item.productSlug]"
                      class="text-dark-100 font-semibold hover:text-primary-400 transition-colors line-clamp-1"
                      >{{ item.productName }}</a
                    >
                    <div
                      class="flex flex-wrap gap-2 mt-1 text-sm text-dark-400"
                    >
                      @if (item.sizeName) {
                        <span>Taille: {{ item.sizeName }}</span>
                      }
                      @if (item.colorName) {
                        <span>Couleur: {{ item.colorName }}</span>
                      }
                    </div>
                    <div class="text-primary-400 font-bold mt-2">
                      {{ fmt(item.unitPrice) }}
                    </div>
                    <div class="flex items-center justify-between mt-4">
                      <div
                        class="flex items-center border border-dark-700 rounded-lg overflow-hidden"
                      >
                        <button
                          (click)="updateQty(item.id, item.quantity - 1)"
                          class="w-8 h-8 flex items-center justify-center text-dark-100 hover:bg-dark-800"
                        >
                          &#8722;
                        </button>
                        <span
                          class="w-10 h-8 flex items-center justify-center text-dark-100 text-sm"
                          >{{ item.quantity }}</span
                        >
                        <button
                          (click)="updateQty(item.id, item.quantity + 1)"
                          [disabled]="item.quantity >= item.availableStock"
                          class="w-8 h-8 flex items-center justify-center text-dark-100 hover:bg-dark-800 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          +
                        </button>
                      </div>
                      <button
                        (click)="remove(item.id)"
                        class="text-dark-500 hover:text-red-400 transition-colors"
                      >
                        <svg
                          class="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div class="hidden md:block text-right">
                    <span class="text-dark-100 font-bold">{{
                      fmt(item.totalPrice)
                    }}</span>
                  </div>
                </div>
              }
            </div>
            <div>
              <div class="glass rounded-2xl p-6 sticky top-24 space-y-4">
                <h3 class="text-dark-100 font-bold text-lg">Résumé</h3>
                <div class="space-y-3 text-sm">
                  <div class="flex justify-between">
                    <span class="text-dark-400">{{ i18n.t().cart.subtotal }}</span>
                    <span class="text-dark-100">{{
                      fmt(cartData()!.subtotal)
                    }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-dark-400">Livraison</span>
                    <span
                      [class]="
                        cartData()!.shippingCost === 0
                          ? 'text-green-400'
                          : 'text-dark-100'
                      "
                    >
                      {{
                        cartData()!.shippingCost === 0
                          ? "" + i18n.t().cart.free
                          : fmt(cartData()!.shippingCost)
                      }}
                    </span>
                  </div>
                  @if (cartData()!.shippingCost === 0) {
                    <p class="text-green-400/70 text-xs">
                      &#10003; Livraison gratuite dès 150 TND
                    </p>
                  }
                  <hr class="border-dark-700" />
                  <div class="flex justify-between text-lg font-bold">
                    <span class="text-dark-100">Total</span>
                    <span class="text-primary-400">{{
                      fmt(cartData()!.total)
                    }}</span>
                  </div>
                </div>
                <a
                  routerLink="/checkout"
                  class="btn-gold w-full text-center block"
                  >{{ i18n.t().cart.checkout }}</a
                >
                <a
                  routerLink="/shop"
                  class="text-center block text-sm text-dark-400 hover:text-primary-400"
                  >{{ i18n.t().cart.continueShopping }}</a
                >
              </div>
            </div>
          </div>
        } @else {
          <div class="text-center py-20">
            <svg
              class="w-24 h-24 mx-auto text-dark-700 mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h3 class="text-dark-300 text-2xl font-bold mb-2">
              {{ i18n.t().cart.empty }}
            </h3>
            <p class="text-dark-500 mb-8">Découvrez notre collection</p>
            <a routerLink="/shop" class="btn-gold">Explorer la Boutique</a>
          </div>
        }
      </div>
    </div>
  `,
})
export class CartPageComponent {
  i18n = inject(I18nService);
  private cs = inject(CartService);
  cartData = computed(() => this.cs.cart());

  /**
   * Construit l'URL de l'image :
   * - URL Cloudinary complète (https://res.cloudinary.com/...) → retournée telle quelle
   * - URL locale (/uploads/... ou uploads/...) → http://localhost:8080/api/uploads/...
   * - Null/vide → chaîne vide (géré par @if dans le template)
   */
  getImageUrl(url: string | null | undefined): string {
    if (!url) return "";

    // ✅ URL Cloudinary ou autre URL complète → on l'utilise directement
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    // ✅ URL locale → on préfixe avec l'adresse du backend
    const path = url.startsWith("/") ? url : "/" + url;
    return `http://localhost:8080/api${path}`;
  }

  // Quand l'image ne charge pas → remplace par le placeholder SVG
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = "none";
    // Affiche l'icône placeholder dans le parent
    const parent = img.parentElement;
    if (parent) {
      parent.innerHTML = `
        <div class="w-full h-full flex items-center justify-center text-dark-600">
          <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
        </div>`;
    }
  }

  updateQty(id: number, q: number): void {
    if (q <= 0) {
      this.cs.removeFromCart(id).subscribe();
    } else {
      const item = this.cartData()?.items.find((i) => i.id === id);
      if (item && q > item.availableStock) return;
      this.cs.updateCartItem(id, q).subscribe();
    }
  }

  remove(id: number): void {
    this.cs.removeFromCart(id).subscribe();
  }

  fmt(n: number): string {
    return this.cs.formatPrice(n);
  }
}
