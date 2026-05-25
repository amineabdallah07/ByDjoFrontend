import { Component, Input, Output, EventEmitter, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { Product } from "../../../core/models/interfaces";
import { CartService } from "../../../core/services/cart.service";
import { CloudinaryService } from "../../../core/services/cloudinary.service";

@Component({
  selector: "app-product-card",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Toast "Ajouté au panier" -->
    @if (showToast()) {
      <div
        class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2
               bg-dark-800 border border-primary-500/40 text-dark-100 text-sm font-medium
               px-5 py-3 rounded-2xl shadow-xl animate-fade-up pointer-events-none"
      >
        <svg class="w-4 h-4 text-primary-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
        </svg>
        Ajouté au panier ✓
      </div>
    }

    <div
      class="card-product group"
      (mouseenter)="hovered = true"
      (mouseleave)="hovered = false"
    >
      <a [routerLink]="['/product', product.slug]" class="block">
        <!-- Image -->
        <div class="relative aspect-[3/4] bg-dark-800 overflow-hidden">
          @if (product.images && product.images.length > 0) {
            <img
              [src]="getPrimaryImageUrl(product.images)"
              [alt]="product.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          } @else {
            <div
              class="absolute inset-0 bg-gradient-to-br from-dark-800 to-dark-900 flex items-center justify-center"
            >
              <span
                class="text-dark-600 font-black text-2xl tracking-widest opacity-30"
                >BY DJO</span
              >
            </div>
          }

          <!-- Badges -->
          <div class="absolute top-3 left-3 flex flex-col gap-1.5">
            @if (product.isNew) {
              <span
                class="px-2.5 py-1 bg-primary-500 text-dark-950 text-[10px] font-bold rounded-md uppercase tracking-wider"
              >
                Nouveau
              </span>
            }
            @if (product.bestseller) {
              <span
                class="px-2.5 py-1 bg-green-500 text-dark-950 text-[10px] font-bold rounded-md uppercase tracking-wider"
              >
                Best-seller
              </span>
            }
            @if (product.discountPercentage > 0) {
              <span
                class="px-2.5 py-1 bg-red-500 text-white text-[10px] font-bold rounded-md uppercase tracking-wider"
              >
                -{{ product.discountPercentage }}%
              </span>
            }
          </div>

          <!-- Quick Add Button -->
          <div
            [class]="
              hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            "
            class="absolute bottom-2 right-2 transition-all duration-300"
          >
            <button
              (click)="onAddToCart($event)"
              [class]="added() ? 'bg-green-500 hover:bg-green-400 scale-110' : 'bg-primary-500 hover:bg-primary-400'"
              class="w-8 h-8 text-dark-950 rounded-full flex items-center justify-center
                     shadow-md transition-all duration-300"
            >
              @if (added()) {
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                </svg>
              } @else {
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
              }
            </button>
          </div>
        </div>
      </a>

      <!-- Info -->
      <div class="p-4">
        <a [routerLink]="['/product', product.slug]">
          <p class="text-dark-500 text-[11px] uppercase tracking-wider mb-1">
            {{ product.category?.name }}
          </p>
          <h3
            class="text-dark-100 font-semibold text-sm group-hover:text-primary-400 transition-colors line-clamp-1 mb-2"
          >
            {{ product.name }}
          </h3>
        </a>
        <div class="flex items-center gap-2">
          <span class="text-primary-400 font-bold text-sm">{{
            formatPrice(product.price)
          }}</span>
          @if (
            product.compareAtPrice && product.compareAtPrice > product.price
          ) {
            <span class="text-dark-600 text-xs line-through">{{
              formatPrice(product.compareAtPrice)
            }}</span>
          }
        </div>
      </div>
    </div>
  `,
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() addCart = new EventEmitter<Product>();
  hovered = false;
  added = signal(false);
  showToast = signal(false);

  constructor(
    private cartService: CartService,
    private cloudinary: CloudinaryService,
  ) {}

  getPrimaryImageUrl(images: { url: string; isPrimary?: boolean }[]): string {
    const primary = images.find((img) => img.isPrimary) || images[0];
    return this.cloudinary.getThumbnailUrl(primary.url);
  }

  getImageUrl(url: string): string {
    return this.cloudinary.getThumbnailUrl(url);
  }

  onAddToCart(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.added()) return;

    this.addCart.emit(this.product);
    this.cartService
      .addToCart({ productId: this.product.id, quantity: 1 })
      .subscribe({
        next: () => {
          // Feedback visuel sur le bouton
          this.added.set(true);
          // Toast global
          this.showToast.set(true);
          setTimeout(() => {
            this.added.set(false);
            this.showToast.set(false);
          }, 2000);
        },
      });
  }

  formatPrice(amount: number): string {
    return this.cartService.formatPrice(amount);
  }
}
