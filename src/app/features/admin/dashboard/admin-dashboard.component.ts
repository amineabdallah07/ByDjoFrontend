import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { AdminService } from "../../../core/services/admin.service";
import { OrderService } from "../../../core/services/order.service";

@Component({
  selector: "app-admin-dashboard",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-8">
      <!-- Header -->
      <div>
        <h1 class="text-3xl font-black text-dark-100">Dashboard</h1>
        <p class="text-dark-400 mt-1">
          Vue d'ensemble de votre boutique BY DJO
        </p>
      </div>

      <!-- Loading state -->
      @if (loading) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          @for (i of [1, 2, 3, 4]; track i) {
            <div class="glass rounded-2xl p-6 animate-pulse">
              <div class="h-12 w-12 bg-dark-700 rounded-xl mb-4"></div>
              <div class="h-4 w-24 bg-dark-700 rounded mb-2"></div>
              <div class="h-8 w-32 bg-dark-700 rounded"></div>
            </div>
          }
        </div>
      }

      @if (!loading && stats) {
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Revenue -->
          <div class="glass rounded-2xl p-6 border border-green-500/10">
            <div class="flex items-center justify-between mb-4">
              <div
                class="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center"
              >
                <svg
                  class="w-6 h-6 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span
                [class]="getGrowthClass(stats.revenueGrowth)"
                class="text-xs font-semibold px-2 py-1 rounded-lg"
              >
                {{ stats.revenueGrowth > 0 ? "+" : ""
                }}{{ stats.revenueGrowth }}%
              </span>
            </div>
            <p class="text-dark-400 text-sm mb-1">Revenu Total</p>
            <p class="text-2xl font-bold text-dark-100">
              {{ stats.totalRevenue?.toFixed(3) }} TND
            </p>
            <p class="text-dark-500 text-xs mt-1">
              Ce mois: {{ stats.monthRevenue?.toFixed(3) }} TND
            </p>
          </div>

          <!-- Orders -->
          <div class="glass rounded-2xl p-6 border border-primary-500/10">
            <div class="flex items-center justify-between mb-4">
              <div
                class="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center"
              >
                <svg
                  class="w-6 h-6 text-primary-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <span
                [class]="getGrowthClass(stats.ordersGrowth)"
                class="text-xs font-semibold px-2 py-1 rounded-lg"
              >
                {{ stats.ordersGrowth > 0 ? "+" : "" }}{{ stats.ordersGrowth }}%
              </span>
            </div>
            <p class="text-dark-400 text-sm mb-1">Commandes Totales</p>
            <p class="text-2xl font-bold text-dark-100">{{ stats.totalOrders }}</p>
            <p class="text-dark-500 text-xs mt-1">
              Ce mois: {{ stats.monthOrders }}
            </p>
          </div>

          <!-- Products -->
          <div class="glass rounded-2xl p-6 border border-blue-500/10">
            <div class="flex items-center justify-between mb-4">
              <div
                class="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center"
              >
                <svg
                  class="w-6 h-6 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
            </div>
            <p class="text-dark-400 text-sm mb-1">Produits Actifs</p>
            <p class="text-2xl font-bold text-dark-100">
              {{ stats.activeProducts }}
            </p>
            <p class="text-dark-500 text-xs mt-1">
              Total: {{ stats.totalProducts }}
            </p>
          </div>

          <!-- Customers -->
          <div class="glass rounded-2xl p-6 border border-purple-500/10">
            <div class="flex items-center justify-between mb-4">
              <div
                class="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center"
              >
                <svg
                  class="w-6 h-6 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            </div>
            <p class="text-dark-400 text-sm mb-1">Clients Inscrits</p>
            <p class="text-2xl font-bold text-dark-100">
              {{ stats.totalCustomers }}
            </p>
          </div>
        </div>

        <!-- Order Status Summary -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          @for (status of orderStatuses; track status.key) {
            <div
              class="glass rounded-xl p-4 text-center cursor-pointer hover:border-opacity-30 transition-all border"
              [class]="status.borderClass"
              [routerLink]="['/admin/orders']"
            >
              <p class="text-2xl font-bold" [class]="status.textClass">
                {{ stats[status.key] || 0 }}
              </p>
              <p class="text-dark-400 text-xs mt-1">{{ status.label }}</p>
            </div>
          }
        </div>

        <!-- Charts Row -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Monthly Revenue Chart -->
          <div class="lg:col-span-2 glass rounded-2xl p-6">
            <h2 class="text-xl font-bold text-dark-100 mb-6">Revenus Mensuels</h2>
            @if (monthlyData.length > 0) {
              <div class="relative h-48">
                <div class="flex items-end h-full gap-2">
                  @for (month of monthlyData; track month.monthKey) {
                    <div class="flex-1 flex flex-col items-center gap-1">
                      <span class="text-xs text-dark-500">{{
                        month.revenue?.toFixed(0)
                      }}</span>
                      <div
                        [style.height.%]="getBarHeight(month.revenue)"
                        class="w-full bg-primary-500/20 hover:bg-primary-500/40 rounded-t-sm transition-all cursor-default border-t-2 border-primary-500 min-h-[4px]"
                        [title]="
                          month.month +
                          ': ' +
                          month.revenue?.toFixed(3) +
                          ' TND'
                        "
                      ></div>
                      <span
                        class="text-xs text-dark-500 transform -rotate-45 origin-top-left mt-2"
                        >{{ month.month.split(" ")[0] }}</span
                      >
                    </div>
                  }
                </div>
              </div>
            } @else {
              <div class="h-48 flex items-center justify-center text-dark-500">
                Aucune donnée disponible
              </div>
            }
          </div>

          <!-- Best Selling Products -->
          <div class="glass rounded-2xl p-6">
            <h2 class="text-xl font-bold text-dark-100 mb-4">Top Produits</h2>
            <div class="space-y-3">
              @for (product of bestProducts.slice(0, 5); track product.id) {
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 bg-dark-800 rounded-lg overflow-hidden shrink-0"
                  >
                    @if (product.imageUrl) {
                      <img
                        [src]="product.imageUrl"
                        [alt]="product.name"
                        class="w-full h-full object-cover"
                      />
                    } @else {
                      <div
                        class="w-full h-full flex items-center justify-center text-dark-500"
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
                            stroke-width="1"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    }
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-dark-100 text-sm font-medium truncate">
                      {{ product.name }}
                    </p>
                    <p class="text-dark-500 text-xs">
                      {{ product.totalSold }} vendus
                    </p>
                  </div>
                  <span
                    class="text-primary-400 text-sm font-semibold shrink-0"
                    >{{ product.price?.toFixed(3) }}</span
                  >
                </div>
              }
              @if (bestProducts.length === 0) {
                <p class="text-dark-500 text-sm text-center py-4">
                  Aucun produit vendu
                </p>
              }
            </div>
          </div>
        </div>

        <!-- Recent Orders + Low Stock -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Recent Orders -->
          <div class="lg:col-span-2 glass rounded-2xl p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-bold text-dark-100">Commandes Récentes</h2>
              <a
                routerLink="/admin/orders"
                class="text-primary-400 text-sm hover:underline"
                >Voir tout →</a
              >
            </div>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="text-left border-b border-dark-800">
                    <th class="pb-3 text-dark-400 text-xs font-medium">N°</th>
                    <th class="pb-3 text-dark-400 text-xs font-medium">
                      Client
                    </th>
                    <th class="pb-3 text-dark-400 text-xs font-medium">
                      Total
                    </th>
                    <th class="pb-3 text-dark-400 text-xs font-medium">
                      Statut
                    </th>
                    <th class="pb-3 text-dark-400 text-xs font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  @for (order of recentOrders; track order.id) {
                    <tr
                      class="border-b border-dark-800/50 hover:bg-dark-800/20"
                    >
                      <td class="py-3 text-dark-100 font-mono text-xs">
                        #{{ order.orderNumber }}
                      </td>
                      <td class="py-3 text-dark-300 text-sm">
                        {{ order.shippingFullName }}
                      </td>
                      <td class="py-3 text-primary-400 font-semibold text-sm">
                        {{ order.total?.toFixed(3) }} TND
                      </td>
                      <td class="py-3">
                        <span
                          [class]="getStatusClass(order.status)"
                          class="text-xs px-2 py-1 rounded-lg font-medium"
                          >{{ getStatusLabel(order.status) }}</span
                        >
                      </td>
                      <td class="py-3 text-dark-500 text-xs">
                        {{ order.createdAt | date: "dd/MM HH:mm" }}
                      </td>
                    </tr>
                  }
                  @if (recentOrders.length === 0) {
                    <tr>
                      <td
                        colspan="5"
                        class="py-8 text-center text-dark-500 text-sm"
                      >
                        Aucune commande
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>

          <!-- Low Stock Alerts -->
          <div class="glass rounded-2xl p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-bold text-dark-100">Stock Faible</h2>
              @if (lowStockAlerts.length > 0) {
                <span
                  class="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-lg"
                  >{{ lowStockAlerts.length }} alertes</span
                >
              }
            </div>
            <div class="space-y-3">
              @for (item of lowStockAlerts.slice(0, 6); track item.id) {
                <div class="flex items-center gap-3">
                  <div
                    class="w-9 h-9 bg-dark-800 rounded-lg overflow-hidden shrink-0"
                  >
                    @if (item.imageUrl) {
                      <img
                        [src]="item.imageUrl"
                        [alt]="item.name"
                        class="w-full h-full object-cover"
                      />
                    } @else {
                      <div
                        class="w-full h-full bg-red-500/10 flex items-center justify-center"
                      >
                        <svg
                          class="w-4 h-4 text-red-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                      </div>
                    }
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-dark-100 text-xs font-medium truncate">
                      {{ item.name }}
                    </p>
                    <p class="text-red-400 text-xs">
                      {{ item.totalStock }} restants
                    </p>
                  </div>
                </div>
              }
              @if (lowStockAlerts.length === 0) {
                <div class="text-center py-4">
                  <p class="text-green-400 text-sm">✓ Stock OK</p>
                  <p class="text-dark-500 text-xs mt-1">
                    Tous les produits ont assez de stock
                  </p>
                </div>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class AdminDashboardComponent implements OnInit {
  loading = true;
  stats: any = null;
  monthlyData: any[] = [];
  bestProducts: any[] = [];
  recentOrders: any[] = [];
  lowStockAlerts: any[] = [];
  maxRevenue = 0;

  orderStatuses = [
    {
      key: "pendingOrders",
      label: "En attente",
      textClass: "text-yellow-400",
      borderClass: "border-yellow-500/20",
    },
    {
      key: "confirmedOrders",
      label: "Confirmé",
      textClass: "text-blue-400",
      borderClass: "border-blue-500/20",
    },
    {
      key: "preparingOrders",
      label: "Préparation",
      textClass: "text-orange-400",
      borderClass: "border-orange-500/20",
    },
    {
      key: "shippedOrders",
      label: "Expédié",
      textClass: "text-purple-400",
      borderClass: "border-purple-500/20",
    },
    {
      key: "deliveredOrders",
      label: "Livré",
      textClass: "text-green-400",
      borderClass: "border-green-500/20",
    },
    {
      key: "cancelledOrders",
      label: "Annulé",
      textClass: "text-red-400",
      borderClass: "border-red-500/20",
    },
  ];

  constructor(
    private adminService: AdminService,
    private orderService: OrderService,
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;

    this.adminService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });

    this.adminService.getMonthlyAnalytics(6).subscribe({
      next: (data) => {
        this.monthlyData = data || [];
        this.maxRevenue = Math.max(
          ...this.monthlyData.map((m) => m.revenue || 0),
          1,
        );
      },
    });

    this.adminService.getBestSellingProducts(5).subscribe({
      next: (data) => (this.bestProducts = data || []),
    });

    this.orderService.getAllOrders(0, 10).subscribe({
      next: (r) => (this.recentOrders = r.content || []),
    });

    this.adminService.getInventoryAlerts(5).subscribe({
      next: (data) => (this.lowStockAlerts = data || []),
    });
  }

  getBarHeight(revenue: number): number {
    if (!revenue || this.maxRevenue === 0) return 2;
    return Math.max(2, (revenue / this.maxRevenue) * 100);
  }

  getGrowthClass(growth: number): string {
    if (growth > 0) return "bg-green-500/20 text-green-400";
    if (growth < 0) return "bg-red-500/20 text-red-400";
    return "bg-dark-700 text-dark-400";
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      PENDING: "bg-yellow-500/20 text-yellow-400",
      CONFIRMED: "bg-blue-500/20 text-blue-400",
      PREPARING: "bg-orange-500/20 text-orange-400",
      SHIPPED: "bg-purple-500/20 text-purple-400",
      DELIVERED: "bg-green-500/20 text-green-400",
      CANCELLED: "bg-red-500/20 text-red-400",
    };
    return map[status] || "bg-dark-700 text-dark-400";
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      PENDING: "En attente",
      CONFIRMED: "Confirmé",
      PREPARING: "Préparation",
      SHIPPED: "Expédié",
      DELIVERED: "Livré",
      CANCELLED: "Annulé",
    };
    return map[status] || status;
  }
}
