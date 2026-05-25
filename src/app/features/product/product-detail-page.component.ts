import { Component, OnInit, signal, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, ActivatedRoute } from "@angular/router";
import { ProductService } from "../../core/services/product.service";
import { CartService } from "../../core/services/cart.service";
import { WishlistService } from "../../core/services/wishlist.service";
import { CloudinaryService } from "../../core/services/cloudinary.service";
import { Product } from "../../core/models/interfaces";

@Component({
  selector: "app-product-detail",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="pt-24 pb-20">
      <div class="page-container">
        @if (product()) {
          <div class="grid lg:grid-cols-2 gap-8 lg:gap-16">
            <!-- ===== IMAGES ===== -->
            <div class="space-y-4">
              <div
                class="relative aspect-[3/4] rounded-2xl overflow-hidden bg-dark-900 border border-dark-800"
              >
                @if (getActiveImage()) {
                  <img
                    [src]="getActiveImageUrl()"
                    [alt]="product()!.name"
                    class="w-full h-full object-cover transition-opacity duration-300"
                  />
                } @else {
                  <div
                    class="absolute inset-0 flex items-center justify-center text-dark-600"
                  >
                    <svg
                      class="w-24 h-24"
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
                @if (product()!.discountPercentage > 0) {
                  <span
                    class="absolute top-4 left-4 px-3 py-1.5 bg-red-500 text-white text-sm font-bold rounded-lg"
                  >
                    -{{ product()!.discountPercentage }}%
                  </span>
                }
              </div>
              @if (product()!.images && product()!.images.length > 1) {
                <div class="flex gap-2 overflow-x-auto pb-1">
                  @for (
                    img of product()!.images;
                    track img.id;
                    let i = $index
                  ) {
                    <button
                      (click)="activeImageIndex.set(i)"
                      class="shrink-0 w-16 h-20 rounded-lg overflow-hidden border-2 transition-all"
                      [class.border-primary-500]="activeImageIndex() === i"
                      [class.border-dark-700]="activeImageIndex() !== i"
                    >
                      <img
                        [src]="getThumb(img.url)"
                        [alt]="img.altText || product()!.name"
                        class="w-full h-full object-cover"
                      />
                    </button>
                  }
                </div>
              }
            </div>

            <!-- ===== INFOS ===== -->
            <div class="flex flex-col">
              <nav class="flex items-center gap-2 text-sm text-dark-500 mb-4">
                <a routerLink="/" class="hover:text-dark-100 transition-colors"
                  >Accueil</a
                >
                <span>/</span>
                <a
                  routerLink="/shop"
                  class="hover:text-dark-100 transition-colors"
                  >Boutique</a
                >
                <span>/</span>
                <span class="text-dark-300">{{ categoryName }}</span>
              </nav>

              <h1 class="text-3xl md:text-4xl font-black text-dark-100 mb-3">
                {{ product()!.name }}
              </h1>

              <div class="flex items-center gap-3 mb-6">
                <span class="text-3xl font-bold text-primary-400">{{
                  formatPrice(product()!.price)
                }}</span>
                @if (
                  product()!.compareAtPrice !== null &&
                  product()!.compareAtPrice !== undefined
                ) {
                  <span class="text-xl text-dark-500 line-through">{{
                    formatPrice(product()!.compareAtPrice)
                  }}</span>
                }
              </div>

              <p class="text-dark-400 leading-relaxed mb-8">
                {{ product()!.description }}
              </p>

              @if (availableSizes().length > 0) {
                <div class="mb-6">
                  <h3 class="text-dark-100 font-semibold mb-3">Taille</h3>
                  <div class="flex flex-wrap gap-3">
                    @for (size of availableSizes(); track size) {
                      <button
                        (click)="selectSize(size)"
                        [class]="
                          selectedSize() === size
                            ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                            : 'border-dark-700 text-dark-300 hover:border-dark-500'
                        "
                        class="w-12 h-12 rounded-lg border flex items-center justify-center font-medium transition-all"
                      >
                        {{ size }}
                      </button>
                    }
                  </div>
                </div>
              }

              @if (availableColors().length > 0) {
                <div class="mb-8">
                  <h3 class="text-dark-100 font-semibold mb-3">Couleur</h3>
                  <div class="flex flex-wrap gap-3">
                    @for (color of availableColors(); track color.name) {
                      <button
                        (click)="selectColor(color.name)"
                        [class]="
                          selectedColor() === color.name
                            ? 'ring-2 ring-primary-500 ring-offset-2 ring-offset-dark-950'
                            : ''
                        "
                        class="w-10 h-10 rounded-full border-2 border-dark-700 transition-all"
                        [style.backgroundColor]="color.hex"
                        [title]="color.name"
                      ></button>
                    }
                  </div>
                </div>
              }

              <div class="flex items-center gap-4 mb-8">
                <span class="text-dark-100 font-semibold">Quantité</span>
                <div
                  class="flex items-center border border-dark-700 rounded-lg overflow-hidden"
                >
                  <button
                    (click)="updateQuantity(-1)"
                    class="w-10 h-10 flex items-center justify-center text-dark-100 hover:bg-dark-800"
                  >
                    &#8722;
                  </button>
                  <span
                    class="w-12 h-10 flex items-center justify-center text-dark-100 font-semibold"
                    >{{ quantity() }}</span
                  >
                  <button
                    (click)="updateQuantity(1)"
                    [disabled]="quantity() >= selectedVariantStock()"
                    class="w-10 h-10 flex items-center justify-center text-dark-100 hover:bg-dark-800 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
                <span class="text-dark-500 text-sm">
                  {{
                    selectedVariantStock() > 0
                      ? selectedVariantStock() + " en stock"
                      : "Rupture de stock"
                  }}
                </span>
              </div>

              <!-- ===== BOUTONS PANIER + WISHLIST ===== -->
              <div class="flex gap-3">
                <button
                  (click)="addToCart()"
                  class="btn-gold flex-1 text-lg"
                  [disabled]="selectedVariantStock() === 0"
                >
                  <svg
                    class="w-5 h-5 mr-2 inline"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  Ajouter au panier
                </button>

                <!-- Bouton Wishlist -->
                <button
                  (click)="toggleWishlist()"
                  class="w-14 h-14 flex items-center justify-center rounded-xl border-2 transition-all"
                  [class.border-red-500]="inWishlist()"
                  [class.bg-red-500]="inWishlist()"
                  [class.border-dark-700]="!inWishlist()"
                  [class.hover:border-red-500]="!inWishlist()"
                  [title]="
                    inWishlist() ? 'Retirer des favoris' : 'Ajouter aux favoris'
                  "
                >
                  <svg
                    class="w-6 h-6 transition-all"
                    [class.text-white]="inWishlist()"
                    [class.text-dark-400]="!inWishlist()"
                    [attr.fill]="inWishlist() ? 'currentColor' : 'none'"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>

              @if (wishlistMessage()) {
                <p
                  class="mt-3 text-sm text-center"
                  [class.text-red-400]="inWishlist()"
                  [class.text-dark-400]="!inWishlist()"
                >
                  {{ wishlistMessage() }}
                </p>
              }

              <div class="mt-10 pt-8 border-t border-dark-800 space-y-4">
                @if (product()!.material) {
                  <div class="flex justify-between">
                    <span class="text-dark-500">Matière</span>
                    <span class="text-dark-200">{{ product()!.material }}</span>
                  </div>
                }
                <div class="flex justify-between">
                  <span class="text-dark-500">Catégorie</span>
                  <span class="text-dark-200">{{ categoryName }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-dark-500">Paiement</span>
                  <span class="text-dark-200">Paiement à la livraison</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-dark-500">Livraison</span>
                  <span class="text-dark-200">Partout en Tunisie</span>
                </div>
              </div>
            </div>
          </div>
        } @else {
          <div class="text-center py-32">
            <div
              class="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"
            ></div>
            <p class="text-dark-400">Chargement...</p>
          </div>
        }
      </div>
    </div>
  `,
})
export class ProductDetailPageComponent implements OnInit {
  product = signal<Product | null>(null);
  activeImageIndex = signal(0);
  selectedSize = signal<string | null>(null);
  selectedColor = signal<string | null>(null);
  quantity = signal(1);
  inWishlist = signal(false);
  wishlistMessage = signal("");

  get categoryName(): string {
    const p = this.product();
    return p && p.category ? p.category.name : "";
  }

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private cloudinary: CloudinaryService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.productService.getProductBySlug(params["slug"]).subscribe({
        next: (product) => {
          this.product.set(product);
          if (product.variants && product.variants.length > 0) {
            const v = product.variants[0];
            if (v.sizeName) this.selectedSize.set(v.sizeName);
            if (v.colorName) this.selectedColor.set(v.colorName);
          }
          // Vérifier si déjà en wishlist
          this.wishlistService.isInWishlist(product.id).subscribe({
            next: (status) => this.inWishlist.set(status),
            error: () => {},
          });
        },
      });
    });
  }

  toggleWishlist(): void {
    const product = this.product();
    if (!product) return;

    if (this.inWishlist()) {
      this.wishlistService.removeFromWishlist(product.id).subscribe({
        next: () => {
          this.inWishlist.set(false);
          this.wishlistMessage.set("Retiré des favoris");
          setTimeout(() => this.wishlistMessage.set(""), 2000);
        },
        error: () =>
          this.wishlistMessage.set("Erreur, veuillez vous connecter"),
      });
    } else {
      this.wishlistService.addToWishlist(product.id).subscribe({
        next: () => {
          this.inWishlist.set(true);
          this.wishlistMessage.set("Ajouté aux favoris ♥");
          setTimeout(() => this.wishlistMessage.set(""), 2000);
        },
        error: () =>
          this.wishlistMessage.set("Erreur, veuillez vous connecter"),
      });
    }
  }

  availableSizes = () => [
    ...new Set(
      this.product()
        ?.variants?.filter((v) => v.sizeName && v.stock > 0)
        .map((v) => v.sizeName!) || [],
    ),
  ];

  availableColors = () => [
    ...new Map(
      this.product()
        ?.variants?.filter((v) => v.colorName && v.stock > 0)
        .map((v) => [
          v.colorName!,
          { name: v.colorName!, hex: v.colorHex || "#808080" },
        ]) || [],
    ).values(),
  ];

  selectSize(size: string): void {
    this.selectedSize.set(size);
    this.quantity.set(1);
  }

  selectColor(name: string): void {
    this.selectedColor.set(name);
    this.quantity.set(1);
  }

  selectedVariantStock(): number {
    const product = this.product();
    if (!product?.variants?.length) return product?.totalStock ?? 0;
    const match = product.variants.find(
      (v) =>
        (!this.selectedSize() || v.sizeName === this.selectedSize()) &&
        (!this.selectedColor() || v.colorName === this.selectedColor()),
    );
    return match?.stock ?? 0;
  }

  updateQuantity(delta: number): void {
    const q = this.quantity() + delta;
    if (q >= 1 && q <= this.selectedVariantStock()) this.quantity.set(q);
  }

  addToCart(): void {
    const product = this.product()!;
    const match = product.variants?.find(
      (v) =>
        (!this.selectedSize() || v.sizeName === this.selectedSize()) &&
        (!this.selectedColor() || v.colorName === this.selectedColor()),
    );
    this.cartService
      .addToCart({
        productId: product.id,
        variantId: match?.id,
        quantity: this.quantity(),
      })
      .subscribe();
  }

  formatPrice(amount: number | undefined | null): string {
    if (amount == null) return "0.000 TND";
    return this.cartService.formatPrice(amount);
  }

  getActiveImage(): string | null {
    const imgs = this.product()?.images;
    if (!imgs || imgs.length === 0) return null;
    return imgs[this.activeImageIndex()]?.url || imgs[0]?.url || null;
  }

  getActiveImageUrl(): string {
    const url = this.getActiveImage();
    if (!url) return "";
    return this.cloudinary.getProductUrl(url);
  }

  getThumb(url: string): string {
    return this.cloudinary.getThumbnailUrl(url);
  }
}
