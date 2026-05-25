import { Component, OnInit, signal, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";
import { I18nService } from "../../core/services/i18n.service";
import { ProductService } from "../../core/services/product.service";
import { WishlistService } from "../../core/services/wishlist.service";
import { CartService } from "../../core/services/cart.service";
import { CloudinaryService } from "../../core/services/cloudinary.service";
import { Product } from "../../core/models/interfaces";

@Component({
  selector: "app-wishlist",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="pt-24 pb-20">
      <div class="page-container">
        <div class="flex items-center gap-4 mb-8">
          <a
            routerLink="/account"
            class="text-dark-400 hover:text-dark-100 transition-colors"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </a>
          <h1 class="text-3xl font-black text-dark-100">MA WISHLIST</h1>
          <span class="text-dark-400 text-sm"
            >({{ products().length }} article{{
              products().length > 1 ? "s" : ""
            }})</span
          >
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          @for (product of products(); track product.id) {
            <div class="card-product p-0 relative group">
              <!-- FIX BUG: Bouton Retirer de la wishlist — WishlistService.removeFromWishlist() maintenant appelé -->
              <button
                (click)="removeFromWishlist(product.id)"
                class="absolute top-2 right-2 z-10 w-8 h-8 bg-dark-900/80 backdrop-blur rounded-full flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  />
                </svg>
              </button>

              <a [routerLink]="['/product', product.slug]">
                <!-- FIX BUG: Images de la wishlist — même logique que product-card avec CloudinaryService -->
                <div class="relative aspect-[3/4] bg-dark-800 overflow-hidden">
                  @if (product.images && product.images.length > 0) {
                    <img
                      [src]="getPrimaryImageUrl(product.images)"
                      [alt]="product.name"
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  } @else {
                    <div
                      class="absolute inset-0 flex items-center justify-center"
                    >
                      <span
                        class="text-dark-600 font-black text-xl tracking-widest opacity-30"
                        >BY DJO</span
                      >
                    </div>
                  }
                </div>
                <div class="p-3">
                  <h3 class="text-dark-100 font-medium text-sm line-clamp-1">
                    {{ product.name }}
                  </h3>
                  <div class="flex items-center gap-2 mt-1">
                    <span class="text-primary-400 font-bold text-sm">{{
                      formatPrice(product.price)
                    }}</span>
                    @if (
                      product.compareAtPrice &&
                      product.compareAtPrice > product.price
                    ) {
                      <span class="text-dark-500 text-xs line-through">{{
                        formatPrice(product.compareAtPrice)
                      }}</span>
                    }
                  </div>
                </div>
              </a>

              <!-- Bouton Ajouter au panier -->
              <div class="p-3 pt-0">
                <button
                  (click)="addToCart(product)"
                  [disabled]="product.totalStock === 0"
                  class="w-full btn-primary text-xs py-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  @if (product.totalStock === 0) {
                    Rupture de stock
                  } @else {
                    Ajouter au panier
                  }
                </button>
              </div>
            </div>
          }
        </div>

        @if (products().length === 0) {
          <div class="text-center py-16">
            <svg
              class="w-16 h-16 mx-auto text-dark-700 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <p class="text-dark-400 mb-4">Votre wishlist est vide</p>
            <a routerLink="/shop" class="btn-primary">Explorer la boutique</a>
          </div>
        }
      </div>
    </div>
  `,
})
export class WishlistPageComponent implements OnInit {
  i18n = inject(I18nService);
  products = signal<Product[]>([]);

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private wishlistService: WishlistService,
    private cartService: CartService,
    private cloudinary: CloudinaryService,
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.productService
          .getWishlist()
          .subscribe((products) => this.products.set(products));
      }
    });
  }

  // FIX BUG: Images via CloudinaryService — même logique que product-card.component
  getPrimaryImageUrl(images: { url: string; isPrimary?: boolean }[]): string {
    const primary = images.find((img) => img.isPrimary) || images[0];
    return this.cloudinary.getThumbnailUrl(primary.url);
  }

  // FIX BUG: Bouton Retirer fonctionnel — retire du signal local immédiatement (optimistic update)
  removeFromWishlist(productId: number): void {
    this.products.update((list) => list.filter((p) => p.id !== productId));
    this.wishlistService.removeFromWishlist(productId).subscribe();
  }

  addToCart(product: Product): void {
    this.cartService
      .addToCart({ productId: product.id, quantity: 1 })
      .subscribe();
  }

  formatPrice(amount: number): string {
    return this.cartService.formatPrice(amount);
  }
}
