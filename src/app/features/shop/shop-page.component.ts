import { Component, OnInit, signal, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, ActivatedRoute } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { ProductService } from "../../core/services/product.service";
import { CartService } from "../../core/services/cart.service";
import { Product, Category, PagedResponse } from "../../core/models/interfaces";
import { CloudinaryService } from "../../core/services/cloudinary.service";
import { I18nService } from "../../core/services/i18n.service";

@Component({
  selector: "app-shop",
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="pt-24 pb-20">
      <div class="page-container">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-4xl font-black text-dark-100 mb-2">
            {{ isNew ? i18n.t().shop.newTitle : onSale ? i18n.t().shop.saleTitle : i18n.t().shop.title }}
          </h1>
          <p class="text-dark-400">{{ totalProducts }} {{ i18n.t().shop.products }}</p>
        </div>

        <div class="flex flex-col lg:flex-row gap-8">
          <!-- Sidebar Filters -->
          <aside class="w-full lg:w-64 shrink-0">
            <div class="glass rounded-2xl p-6 space-y-6 sticky top-24">
              <!-- Search -->
              <div>
                <h3
                  class="text-dark-100 font-semibold mb-3 text-sm uppercase tracking-wider"
                >
                  {{ i18n.t().shop.search }}
                </h3>
                <input
                  type="text"
                  [(ngModel)]="searchQuery"
                  (keyup.enter)="applyFilters()"
                  [placeholder]="i18n.t().shop.searchPlaceholder"
                  class="input-dark text-sm"
                />
              </div>

              <!-- Categories -->
              <div>
                <h3
                  class="text-dark-100 font-semibold mb-3 text-sm uppercase tracking-wider"
                >
                  {{ i18n.t().shop.categories }}
                </h3>
                <div class="space-y-2">
                  <button
                    (click)="selectCategory(null)"
                    [class]="
                      !selectedCategory
                        ? 'text-primary-400'
                        : 'text-dark-400 hover:text-dark-100'
                    "
                    class="block w-full text-left text-sm py-1 px-2 rounded transition-colors"
                  >
                    {{ i18n.t().shop.allCategories }}
                  </button>
                  @for (cat of categories; track cat.id) {
                    <button
                      (click)="selectCategory(cat.id)"
                      [class]="
                        selectedCategory === cat.id
                          ? 'text-primary-400'
                          : 'text-dark-400 hover:text-dark-100'
                      "
                      class="block w-full text-left text-sm py-1 px-2 rounded transition-colors"
                    >
                      {{ cat.name }}
                    </button>
                  }
                </div>
              </div>

              <!-- Sort -->
              <div>
                <h3
                  class="text-dark-100 font-semibold mb-3 text-sm uppercase tracking-wider"
                >
                  {{ i18n.t().shop.sortBy }}
                </h3>
                <select
                  [(ngModel)]="sortBy"
                  (change)="applyFilters()"
                  class="input-dark text-sm"
                >
                  <option value="createdAt">{{ i18n.t().shop.newest }}</option>
                  <option value="price">{{ i18n.t().shop.priceLow }}</option>
                  <option value="price-desc">{{ i18n.t().shop.priceHigh }}</option>
                  <option value="totalSold">{{ i18n.t().shop.newest }}</option>
                  <option value="averageRating">{{ i18n.t().shop.newest }}</option>
                </select>
              </div>
            </div>
          </aside>

          <!-- Products Grid -->
          <div class="flex-1">
            @if (loading()) {
              <div class="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                @for (i of [1, 2, 3, 4, 5, 6]; track i) {
                  <div class="card-dark">
                    <div class="aspect-[3/4] skeleton"></div>
                    <div class="p-4 space-y-2">
                      <div class="h-4 skeleton w-3/4"></div>
                      <div class="h-3 skeleton w-1/2"></div>
                      <div class="h-4 skeleton w-1/3"></div>
                    </div>
                  </div>
                }
              </div>
            } @else if (products.length > 0) {
              <div class="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                @for (product of products; track product.id) {
                  <a
                    [routerLink]="['/product', product.slug]"
                    class="card-product"
                  >
                    <div
                      class="relative aspect-[3/4] bg-dark-800 overflow-hidden"
                    >
                      @if (product.images && product.images.length > 0) {
                        <img
                          [src]="
                            getImageUrl(getPrimaryImageUrl(product.images))
                          "
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
                      <div class="absolute top-3 left-3 flex flex-col gap-2">
                        @if (product.isNew) {
                          <span
                            class="px-2 py-1 bg-primary-500 text-dark-950 text-xs font-bold rounded"
                            >{{ i18n.t().shop.new }}</span
                          >
                        }
                        @if (product.discountPercentage > 0) {
                          <span
                            class="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded"
                            >-{{ product.discountPercentage }}%</span
                          >
                        }
                      </div>
                      <button
                        (click)="addToCart(product); $event.stopPropagation()"
                        class="absolute bottom-2 right-2 w-8 h-8 bg-primary-500 hover:bg-primary-400 text-dark-950 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all"
                      >
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
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </button>
                    </div>
                    <div class="p-4">
                      <h3
                        class="text-dark-100 font-semibold text-sm md:text-base mb-1 line-clamp-1"
                      >
                        {{ product.name }}
                      </h3>
                      <p class="text-dark-500 text-xs mb-2">
                        {{ product.category?.name || "" }}
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

              <!-- Pagination -->
              @if (totalPages > 1) {
                <div class="flex items-center justify-center gap-2 mt-12">
                  <button
                    (click)="goToPage(currentPage - 1)"
                    [disabled]="currentPage === 0"
                    class="btn-secondary px-4 py-2 text-sm disabled:opacity-30"
                  >
                    {{ i18n.t().shop.prev }}
                  </button>

                  @for (page of getPageNumbers(); track page) {
                    <button
                      (click)="goToPage(page)"
                      [class]="
                        page === currentPage
                          ? 'btn-primary px-4 py-2 text-sm'
                          : 'btn-secondary px-4 py-2 text-sm'
                      "
                    >
                      {{ page + 1 }}
                    </button>
                  }

                  <button
                    (click)="goToPage(currentPage + 1)"
                    [disabled]="currentPage >= totalPages - 1"
                    class="btn-secondary px-4 py-2 text-sm disabled:opacity-30"
                  >
                    {{ i18n.t().shop.next }}
                  </button>
                </div>
              }
            } @else {
              <div class="text-center py-20">
                <svg
                  class="w-20 h-20 mx-auto text-dark-700 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                <h3 class="text-dark-300 text-xl font-semibold mb-2">
                  {{ i18n.t().shop.noProducts }}
                </h3>
                <p class="text-dark-500">Essayez de modifier vos filtres</p>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ShopPageComponent implements OnInit {
  i18n = inject(I18nService);
  products: Product[] = [];
  categories: Category[] = [];
  loading = signal(true);
  currentPage = 0;
  totalPages = 0;
  totalProducts = 0;
  searchQuery = "";
  selectedCategory: number | null = null;
  sortBy = "createdAt";
  isNew = false;
  onSale = false;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private cloudinary: CloudinaryService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.selectedCategory = params["category"] ? Number(params["category"]) : null;
      this.searchQuery = params["q"] || "";
      this.isNew = params["filter"] === "new";
      this.onSale = params["filter"] === "sale";
      this.sortBy = params["filter"] === "bestseller" ? "totalSold" : "createdAt";
      this.currentPage = 0;
      this.loadProducts();
    });

    this.productService
      .getCategories()
      .subscribe((cats) => (this.categories = cats));
  }

  loadProducts(): void {
    this.loading.set(true);
    this.productService
      .searchProducts(
        this.searchQuery || undefined,
        this.selectedCategory || undefined,
        this.currentPage,
        12,
        this.isNew,
        this.onSale,
      )
      .subscribe({
        next: (response) => {
          this.products = response.content;
          this.totalPages = response.totalPages;
          this.totalProducts = response.totalElements;
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  selectCategory(id: number | null): void {
    this.selectedCategory = id;
    this.currentPage = 0;
    this.loadProducts();
  }

  applyFilters(): void {
    this.currentPage = 0;
    this.loadProducts();
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadProducts();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const start = Math.max(0, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 3);
    for (let i = start; i < end; i++) pages.push(i);
    return pages;
  }

  getPrimaryImageUrl(images: { url: string; isPrimary?: boolean }[]): string {
    const primary = images.find((img) => img.isPrimary) || images[0];
    return this.cloudinary.getThumbnailUrl(primary.url);
  }

  getImageUrl(url: string): string {
    return this.cloudinary.getThumbnailUrl(url);
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
