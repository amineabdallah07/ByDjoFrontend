import {
  Component,
  signal,
  HostListener,
  OnInit,
  ElementRef,
  inject,
  computed,
} from "@angular/core";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../../core/services/auth.service";
import { CartService } from "../../../core/services/cart.service";
import { I18nService } from "../../../core/services/i18n.service";
import { LangSwitcherComponent } from "../lang-switcher/lang-switcher.component";

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LangSwitcherComponent],
  template: `
    <nav
      [class]="scrolled() ? 'glass shadow-lg shadow-black/10' : ''"
      class="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      [dir]="i18n.isRTL() ? 'rtl' : 'ltr'"
    >
      <div class="page-container">
        <div class="flex items-center justify-between h-16 md:h-20">
          <!-- Mobile Menu Toggle -->
          <button
            (click)="toggleMobileMenu()"
            class="lg:hidden text-dark-100 p-2"
          >
            <svg
              [class]="mobileMenuOpen() ? 'hidden' : 'block'"
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <svg
              [class]="mobileMenuOpen() ? 'block' : 'hidden'"
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <!-- Logo -->
          <a routerLink="/" class="flex items-center gap-2 group">
            <img
              src="/bydjo.png"
              alt="BY DJO"
              class="h-20 md:h-25 w-auto object-contain transition-opacity group-hover:opacity-100"
            />
          </a>

          <!-- Desktop Nav Links -->
          <div class="hidden lg:flex items-center gap-8">
            @for (link of navLinks(); track link.path + link.label) {
              <a
                [routerLink]="link.path"
                [queryParams]="link.queryParams || {}"
                routerLinkActive="text-primary-400"
                class="text-sm font-medium text-dark-300 hover:text-primary-400 transition-colors uppercase tracking-wider"
              >
                {{ link.label }}
              </a>
            }
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2 md:gap-3">
            <!-- Language Switcher -->
            <app-lang-switcher />

            <!-- Search -->
            <button
              class="text-dark-300 hover:text-dark-100 transition-colors p-2"
              (click)="toggleSearch()"
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            <!-- Wishlist -->
            <a
              routerLink="/account/wishlist"
              class="hidden md:block text-dark-300 hover:text-dark-100 transition-colors p-2"
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
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </a>

            <!-- Cart -->
            <a
              routerLink="/cart"
              class="relative text-dark-300 hover:text-dark-100 transition-colors p-2"
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
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              @if (cartService.itemCount() > 0) {
                <span
                  class="absolute -top-1 -right-1 bg-primary-500 text-dark-950 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                >
                  {{ cartService.itemCount() }}
                </span>
              }
            </a>

            <!-- User -->
            @if (authService.isLoggedIn()) {
              <div
                class="relative user-menu-trigger"
                (click)="toggleUserMenu($event)"
              >
                <button
                  class="text-dark-300 hover:text-dark-100 transition-colors p-2"
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </button>
                @if (userMenuOpen()) {
                  <div
                    class="absolute right-0 mt-2 w-48 glass rounded-xl py-2 shadow-xl z-50"
                  >
                    <a
                      routerLink="/account"
                      class="block px-4 py-2 text-sm text-dark-300 hover:text-dark-100 hover:bg-dark-800"
                      >{{ i18n.t().nav.myAccount }}</a
                    >
                    <a
                      routerLink="/account/orders"
                      class="block px-4 py-2 text-sm text-dark-300 hover:text-dark-100 hover:bg-dark-800"
                      >{{ i18n.t().nav.myOrders }}</a
                    >
                    @if (authService.isAdmin()) {
                      <a
                        routerLink="/admin"
                        class="block px-4 py-2 text-sm text-primary-400 hover:text-primary-300 hover:bg-dark-800"
                        >{{ i18n.t().nav.adminDashboard }}</a
                      >
                    }
                    <hr class="border-dark-700 my-1" />
                    <button
                      (click)="logout()"
                      class="block w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-dark-800"
                    >
                      {{ i18n.t().nav.logout }}
                    </button>
                  </div>
                }
              </div>
            } @else {
              <a
                routerLink="/auth/login"
                class="hidden md:flex items-center gap-2 text-dark-300 hover:text-primary-400 transition-colors text-sm font-medium"
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                {{ i18n.t().nav.login }}
              </a>
            }
          </div>
        </div>

        <!-- Search Bar -->
        @if (searchOpen()) {
          <div class="pb-4 animate-fade-in">
            <div class="relative">
              <input
                type="text"
                [placeholder]="i18n.t().nav.searchPlaceholder"
                class="input-dark pl-12 text-lg"
                (keyup.enter)="searchProducts($event)"
              />
              <svg
                class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-dark-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        }
      </div>

      <!-- Mobile Menu -->
      @if (mobileMenuOpen()) {
        <div class="lg:hidden glass border-t border-dark-800 animate-fade-in">
          <div class="page-container py-4 space-y-1">
            @for (link of navLinks(); track link.path + link.label) {
              <a
                [routerLink]="link.path"
                [queryParams]="link.queryParams || {}"
                (click)="mobileMenuOpen.set(false)"
                class="block px-4 py-3 text-dark-300 hover:text-dark-100 hover:bg-dark-800 rounded-lg transition-colors font-medium"
              >
                {{ link.label }}
              </a>
            }
            @if (!authService.isLoggedIn()) {
              <a
                routerLink="/auth/login"
                (click)="mobileMenuOpen.set(false)"
                class="block px-4 py-3 text-primary-400 hover:text-primary-300 hover:bg-dark-800 rounded-lg transition-colors font-medium"
              >
                {{ i18n.t().nav.login }}
              </a>
            }
          </div>
        </div>
      }
    </nav>
  `,
})
export class NavbarComponent implements OnInit {
  i18n = inject(I18nService);

  scrolled = signal(false);
  mobileMenuOpen = signal(false);
  searchOpen = signal(false);
  userMenuOpen = signal(false);

  navLinks = computed(() => [
    {
      label: this.i18n.t().nav.newArrivals,
      path: "/shop",
      queryParams: { filter: "new" },
    },
    { label: this.i18n.t().nav.shop, path: "/shop" },
    {
      label: this.i18n.t().nav.tshirts,
      path: "/shop",
      queryParams: { category: "1" },
    },
    {
      label: this.i18n.t().nav.sneakers,
      path: "/shop",
      queryParams: { category: "3" },
    },
    {
      label: this.i18n.t().nav.promos,
      path: "/shop",
      queryParams: { filter: "sale" },
    },
  ]);

  constructor(
    public authService: AuthService,
    public cartService: CartService,
    private router: Router,
    private el: ElementRef,
  ) {}

  ngOnInit(): void {}

  @HostListener("window:scroll")
  onWindowScroll(): void {
    this.scrolled.set(window.scrollY > 50);
  }

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: MouseEvent): void {
    const trigger = this.el.nativeElement.querySelector(".user-menu-trigger");
    if (trigger && !trigger.contains(event.target as Node)) {
      this.userMenuOpen.set(false);
    }
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((v) => !v);
    this.searchOpen.set(false);
  }

  toggleSearch(): void {
    this.searchOpen.update((v) => !v);
    this.mobileMenuOpen.set(false);
  }

  toggleUserMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.userMenuOpen.update((v) => !v);
  }

  searchProducts(event: any): void {
    const query = event.target.value;
    if (query.trim()) {
      this.router.navigate(["/shop"], { queryParams: { q: query } });
      this.searchOpen.set(false);
    }
  }

  logout(): void {
    this.authService.logout();
    this.userMenuOpen.set(false);
    this.router.navigate(["/"]);
  }
}
