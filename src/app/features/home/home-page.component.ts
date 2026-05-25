import { Component, OnInit, signal, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { ProductService } from "../../core/services/product.service";
import { CloudinaryService } from "../../core/services/cloudinary.service";
import { CartService } from "../../core/services/cart.service";
import { I18nService } from "../../core/services/i18n.service";
import { Product, Category } from "../../core/models/interfaces";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <!-- ===== HERO SECTION ===== -->
    <section
      class="relative h-screen min-h-[600px] max-h-[900px] flex items-center overflow-hidden"
    >
      <!-- Background image -->
      <div
        class="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style="background-image: url('by.jpg');"
      ></div>
      <!-- Dark overlay -->
      <div class="absolute inset-0 bg-dark-950/60"></div>

      <div class="page-container relative z-10 w-full">
        <div class="max-w-3xl animate-fade-up">
          <p
            class="text-primary-400 text-sm font-medium tracking-widest uppercase mb-4"
          >
            Nouvelle Collection Disponible
          </p>
          <h1
            class="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-none mb-6"
          >
            PREMIUM<br />
            <span class="text-gradient">STREETWEAR</span>
          </h1>
          <p
            class="text-dark-300 text-lg md:text-xl max-w-xl mb-8 leading-relaxed"
          >
            Découvrez notre collection exclusive de vêtements masculins. Style
            urbain, qualité premium.
          </p>

          <div class="flex flex-wrap gap-4">
            <a routerLink="/shop" class="btn-gold text-lg">
              {{ i18n.t().home.shopNow }}
              <svg
                class="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
            <a
              routerLink="/shop"
              [queryParams]="{ filter: 'new' }"
              class="btn-secondary text-lg"
            >
              {{ i18n.t().home.newArrivals }}
            </a>
          </div>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          class="w-6 h-6 text-dark-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>

    <!-- ===== CATEGORIES SECTION ===== -->
    <section class="py-20">
      <div class="page-container">
        <div class="text-center mb-12">
          <h2 class="section-heading text-dark-100">
            {{ i18n.t().home.categories }}
          </h2>
          <p class="section-subheading">
            {{ i18n.t().home.categoriesSubtitle }}
          </p>
        </div>

        <div
          class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        >
          @for (category of categories; track category.id) {
            <a
              [routerLink]="['/shop']"
              [queryParams]="{ category: category.id }"
              class="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-dark-800 border border-dark-700 hover:border-primary-500/30 transition-all duration-500"
            >
              <img
                [src]="getCategoryImage(category)"
                [alt]="category.name"
                class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/50 to-transparent"
              ></div>
              <div
                class="absolute inset-0 flex flex-col items-center justify-center p-4 text-center"
              >
                <h3
                  class="text-dark-100 font-bold text-lg mb-1 group-hover:text-primary-400 transition-colors"
                >
                  {{ category.name }}
                </h3>
                <span class="text-dark-500 text-sm"
                  >{{ i18n.t().home.shopAll }} →</span
                >
              </div>
            </a>
          }
        </div>
      </div>
    </section>

    <!-- ===== FEATURED PRODUCTS ===== -->
    <section class="py-20 bg-dark-950/50">
      <div class="page-container">
        <div class="flex items-end justify-between mb-12">
          <div>
            <h2 class="section-heading text-dark-100">
              {{ i18n.t().home.featuredProducts }}
            </h2>
            <p class="section-subheading">
              {{ i18n.t().home.featuredSubtitle }}
            </p>
          </div>
          <a
            routerLink="/shop"
            class="hidden md:flex items-center gap-2 text-primary-400 hover:text-primary-300 font-medium transition-colors"
          >
            {{ i18n.t().home.seeAll }}
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>

        <div
          class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        >
          @for (product of featuredProducts; track product.id) {
            <a [routerLink]="['/product', product.slug]" class="card-product">
              <div class="relative aspect-[3/4] bg-dark-800 overflow-hidden">
                @if (getPrimaryImageUrl(product.images); as imgUrl) {
                  <img
                    [src]="imgUrl"
                    [alt]="product.name"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                } @else {
                  <div
                    class="absolute inset-0 flex items-center justify-center text-dark-600"
                  >
                    <svg
                      class="w-16 h-16"
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
                <!-- Product badges -->
                <div class="absolute top-3 left-3 flex flex-col gap-2">
                  @if (product.isNew) {
                    <span
                      class="px-2 py-1 bg-primary-500 text-dark-950 text-xs font-bold rounded"
                    >
                      {{ i18n.t().home.new }}
                    </span>
                  }
                  @if (product.discountPercentage > 0) {
                    <span
                      class="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded"
                    >
                      -{{ product.discountPercentage }}%
                    </span>
                  }
                </div>
                <!-- Quick actions -->
                <div
                  class="absolute bottom-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <button
                    (click)="addToCart(product); $event.stopPropagation()"
                    class="w-10 h-10 bg-primary-500 hover:bg-primary-400 text-dark-950 rounded-full flex items-center justify-center shadow-lg transition-all"
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
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div class="p-4">
                <h3
                  class="text-dark-100 font-semibold text-sm md:text-base mb-1 hover:text-primary-400 transition-colors line-clamp-1"
                >
                  {{ product.name }}
                </h3>
                <p class="text-dark-500 text-xs mb-2">
                  {{ product.category?.name }}
                </p>
                <div class="flex items-center gap-2">
                  <span class="text-primary-400 font-bold">{{
                    formatPrice(product.price)
                  }}</span>
                  @if (product.compareAtPrice) {
                    <span class="text-dark-500 text-sm line-through">{{
                      formatPrice(product.compareAtPrice)
                    }}</span>
                  }
                </div>
              </div>
            </a>
          }
        </div>
      </div>
    </section>

    <!-- ===== NEW ARRIVALS ===== -->
    <section class="py-20 bg-dark-950/50">
      <div class="page-container">
        <div class="flex items-end justify-between mb-12">
          <div>
            <h2 class="section-heading text-dark-100">
              {{ i18n.t().home.newArrivals }}
            </h2>
            <p class="section-subheading">
              {{ i18n.t().home.featuredSubtitle }}
            </p>
          </div>
          <a
            routerLink="/shop"
            [queryParams]="{ filter: 'new' }"
            class="hidden md:flex items-center gap-2 text-primary-400 hover:text-primary-300 font-medium transition-colors"
          >
            {{ i18n.t().home.seeAll }} →
          </a>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          @for (product of newProducts; track product.id) {
            <a
              [routerLink]="['/product', product.slug]"
              class="card-product p-0"
            >
              <div class="relative aspect-[3/4] bg-dark-800 overflow-hidden">
                @if (getPrimaryImageUrl(product.images); as imgUrl) {
                  <img
                    [src]="imgUrl"
                    [alt]="product.name"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                } @else {
                  <div
                    class="absolute inset-0 flex items-center justify-center text-dark-600"
                  >
                    <svg
                      class="w-12 h-12"
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
                <span
                  class="absolute top-3 left-3 px-2 py-1 bg-primary-500 text-dark-950 text-xs font-bold rounded"
                >
                  NOUVEAU
                </span>
              </div>
              <div class="p-3">
                <h3 class="text-dark-100 font-medium text-sm line-clamp-1">
                  {{ product.name }}
                </h3>
                <span class="text-primary-400 font-bold text-sm">{{
                  formatPrice(product.price)
                }}</span>
              </div>
            </a>
          }
        </div>
      </div>
    </section>

    <!-- ===== NEWSLETTER ===== -->
    <section class="py-20">
      <div class="page-container">
        <div class="glass-gold rounded-3xl p-8 md:p-16 text-center">
          <h2 class="text-3xl md:text-4xl font-bold text-dark-100 mb-4">
            {{ i18n.t().home.whyUs }}
          </h2>
          <p class="text-dark-400 text-lg mb-8 max-w-xl mx-auto">
            {{ i18n.t().home.whyUsSubtitle }}
          </p>
          @if (newsletterState() === "success") {
            <div
              class="flex items-center justify-center gap-2 text-green-400 font-medium py-3 animate-fade-in"
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {{ i18n.t().common.confirm }}!
            </div>
          } @else {
            <div class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                [(ngModel)]="newsletterEmail"
                [placeholder]="i18n.t().nav.searchPlaceholder"
                class="input-dark flex-1"
                (keyup.enter)="submitNewsletter()"
              />
              <button
                (click)="submitNewsletter()"
                [disabled]="newsletterState() === 'loading'"
                class="btn-gold whitespace-nowrap disabled:opacity-60"
              >
                @if (newsletterState() === "loading") {
                  <div
                    class="w-4 h-4 border-2 border-dark-950 border-t-transparent rounded-full animate-spin mx-auto"
                  ></div>
                } @else {
                  {{ i18n.t().common.confirm }}
                }
              </button>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class HomePageComponent implements OnInit {
  i18n = inject(I18nService);
  categories: Category[] = [];
  featuredProducts: Product[] = [];
  newProducts: Product[] = [];
  newsletterEmail = "";
  newsletterState = signal<"idle" | "loading" | "success" | "error">("idle");

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private cloudinary: CloudinaryService,
  ) {}

  ngOnInit(): void {
    this.productService.getCategories().subscribe({
      next: (cats) => (this.categories = cats),
      error: () => {},
    });

    this.productService.getFeaturedProducts().subscribe({
      next: (products) => (this.featuredProducts = products),
      error: () => {},
    });

    this.productService.getNewArrivals().subscribe({
      next: (products) => (this.newProducts = products),
      error: () => {},
    });
  }

  addToCart(product: Product): void {
    this.cartService
      .addToCart({ productId: product.id, quantity: 1 })
      .subscribe();
  }

  submitNewsletter(): void {
    if (!this.newsletterEmail.trim() || !this.newsletterEmail.includes("@"))
      return;
    this.newsletterState.set("loading");
    setTimeout(() => {
      this.newsletterState.set("success");
      this.newsletterEmail = "";
      setTimeout(() => this.newsletterState.set("idle"), 4000);
    }, 800);
  }

  getPrimaryImageUrl(
    images: { url: string; isPrimary?: boolean }[] | undefined | null,
  ): string | null {
    if (!images || images.length === 0) return null;
    const primary = images.find((img) => img.isPrimary) || images[0];
    return this.cloudinary.getThumbnailUrl(primary.url);
  }

  private readonly categoryImageMap: Record<string, string> = {
    "t-shirt":
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
    tshirt:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
    chemise:
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80",
    veste:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",
    jacket:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",
    hoodie:
      "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80",
    sweat:
      "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80",
    pantalon:
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80",
    jean: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80",
    short:
      "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=600&q=80",
    pull: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80",
    manteau:
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80",
    robe: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80",
    casquette:
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80",
    cap: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80",
    chapeau:
      "https://images.unsplash.com/photo-1529958030586-3aae4ca485ff?w=600&q=80",
    sac: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
    bag: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
    chaussure:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    sneaker:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    ceinture:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
    lunette:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80",
    montre:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
    bijou:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80",
    homme:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    femme:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80",
    enfant:
      "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=600&q=80",
    collection:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    solde:
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80",
    nouveau:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80",
  };

  private readonly fallbackImages = [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80",
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
    "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80",
  ];

  getCategoryImage(category: Category): string {
    if (category.image) return category.image;
    const nameLower = (
      category.name +
      " " +
      (category.slug || "")
    ).toLowerCase();
    for (const [key, url] of Object.entries(this.categoryImageMap)) {
      if (nameLower.includes(key)) return url;
    }
    return this.fallbackImages[category.id % this.fallbackImages.length];
  }

  formatPrice(amount: number): string {
    return this.cartService.formatPrice(amount);
  }
}
