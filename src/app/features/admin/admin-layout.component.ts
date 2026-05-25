import { Component, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, RouterOutlet, RouterLinkActive } from "@angular/router";

@Component({
  selector: "app-admin-layout",
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, RouterLinkActive],
  template: `
    <div class="pt-20 min-h-screen flex">
      <!-- Mobile overlay -->
      @if (mobileOpen()) {
        <div
          class="fixed inset-0 bg-dark-50/40 z-30 lg:hidden"
          (click)="mobileOpen.set(false)"
        ></div>
      }

      <!-- Sidebar -->
      <aside
        [class]="
          mobileOpen() ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        "
        class="w-64 bg-dark-950 border-r border-dark-800 fixed left-0 top-20 bottom-0 overflow-y-auto z-40 transition-transform duration-300"
      >
        <div class="p-5">
          <div class="flex items-center gap-2 mb-6 px-2">
            <div
              class="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center"
            >
              <svg
                class="w-4 h-4 text-primary-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <span class="text-dark-100 font-bold text-sm">Admin Panel</span>
          </div>

          <p
            class="text-xs font-semibold text-dark-600 uppercase tracking-widest mb-3 px-2"
          >
            Navigation
          </p>
          <nav class="space-y-1">
            @for (item of navItems; track item.path) {
              <a
                [routerLink]="item.path"
                [routerLinkActiveOptions]="
                  item.exact ? { exact: true } : { exact: false }
                "
                routerLinkActive="!bg-primary-500/15 !text-primary-400 !border-primary-500/30"
                (click)="mobileOpen.set(false)"
                class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-dark-400 hover:text-dark-100 hover:bg-dark-800 border border-transparent transition-all"
              >
                <span [innerHTML]="item.icon" class="w-5 h-5 shrink-0"></span>
                <span class="font-medium text-sm">{{ item.label }}</span>
              </a>
            }
          </nav>

          <hr class="border-dark-800 my-5" />

          <a
            routerLink="/"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-dark-500 hover:text-dark-100 hover:bg-dark-800 transition-all"
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
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span class="font-medium text-sm">Voir le site</span>
          </a>
        </div>
      </aside>

      <!-- Mobile toggle button -->
      <button
        (click)="mobileOpen.set(!mobileOpen())"
        class="fixed bottom-6 right-6 z-50 lg:hidden bg-primary-500 text-dark-950 w-12 h-12 rounded-full flex items-center justify-center shadow-lg shadow-primary-500/30"
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
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <!-- Main Content -->
      <main class="flex-1 lg:ml-64 p-5 md:p-8 min-w-0">
        <router-outlet />
      </main>
    </div>
  `,
})
export class AdminLayoutComponent {
  mobileOpen = signal(false);

  navItems = [
    {
      path: "/admin",
      exact: true,
      label: "Dashboard",
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>',
    },
    {
      path: "/admin/products",
      exact: false,
      label: "Produits",
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>',
    },
    {
      path: "/admin/orders",
      exact: false,
      label: "Commandes",
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>',
    },
    {
      path: "/admin/customers",
      exact: false,
      label: "Clients",
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
    },
    {
      path: "/admin/promotions",
      exact: false,
      label: "Promotions",
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>',
    },
    {
      path: "/admin/settings",
      exact: false,
      label: "Paramètres",
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
    },
  ];
}
