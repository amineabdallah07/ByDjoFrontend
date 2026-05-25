import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { OrderService } from "../../../core/services/order.service";
import { Order, OrderStatus } from "../../../core/models/interfaces";

@Component({
  selector: "app-admin-orders",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 class="text-3xl font-black text-dark-100">Commandes</h1>
          <p class="text-dark-400 text-sm mt-1">
            {{ totalElements }} commande(s) au total
          </p>
        </div>
      </div>

      <!-- Status Filter Tabs -->
      <div class="flex flex-wrap gap-2">
        @for (s of statuses; track s.value) {
          <button
            (click)="filterByStatus(s.value)"
            [class]="
              selectedStatus === s.value
                ? s.activeClass
                : 'bg-dark-800 text-dark-400 hover:bg-dark-700'
            "
            class="px-4 py-2 rounded-xl text-sm font-medium transition-all"
          >
            {{ s.label }}
            @if (statusCounts[s.value] !== undefined) {
              <span class="ml-1.5 text-xs opacity-70"
                >({{ statusCounts[s.value] }})</span
              >
            }
          </button>
        }
      </div>

      <!-- Search Bar -->
      <div class="relative">
        <input
          type="text"
          [(ngModel)]="searchQuery"
          (keyup.enter)="search()"
          placeholder="Rechercher par numéro, nom, téléphone..."
          class="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-2.5 text-dark-100 placeholder-dark-500 focus:border-primary-500 focus:outline-none pl-10"
        />
        <svg
          class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-dark-500"
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

      <!-- Orders Table -->
      <div class="glass rounded-2xl overflow-hidden">
        @if (loading) {
          <div class="p-12 text-center text-dark-500">
            <div
              class="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"
            ></div>
            Chargement...
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="text-left border-b border-dark-800 bg-dark-900/50">
                  <th
                    class="p-4 text-dark-400 text-xs font-medium uppercase tracking-wider"
                  >
                    N° Commande
                  </th>
                  <th
                    class="p-4 text-dark-400 text-xs font-medium uppercase tracking-wider"
                  >
                    Client
                  </th>
                  <th
                    class="p-4 text-dark-400 text-xs font-medium uppercase tracking-wider"
                  >
                    Téléphone
                  </th>
                  <th
                    class="p-4 text-dark-400 text-xs font-medium uppercase tracking-wider"
                  >
                    Produits
                  </th>
                  <th
                    class="p-4 text-dark-400 text-xs font-medium uppercase tracking-wider"
                  >
                    Total
                  </th>
                  <th
                    class="p-4 text-dark-400 text-xs font-medium uppercase tracking-wider"
                  >
                    Statut
                  </th>
                  <th
                    class="p-4 text-dark-400 text-xs font-medium uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    class="p-4 text-dark-400 text-xs font-medium uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                @for (order of orders; track order.id) {
                  <tr
                    class="border-b border-dark-800/50 hover:bg-dark-800/20 transition-colors"
                  >
                    <td class="p-4">
                      <span class="text-dark-100 font-mono font-medium text-sm"
                        >#{{ order.orderNumber }}</span
                      >
                    </td>
                    <td class="p-4">
                      <div>
                        <p class="text-dark-100 text-sm font-medium">
                          {{ order.shippingFullName }}
                        </p>
                        @if (order.isGuest) {
                          <span
                            class="text-xs bg-dark-700 text-dark-400 px-1.5 py-0.5 rounded"
                            >Invité</span
                          >
                        }
                      </div>
                    </td>
                    <td class="p-4 text-dark-300 text-sm">
                      {{ order.shippingPhone }}
                    </td>
                    <td class="p-4 text-dark-400 text-xs">
                      {{ order.items?.length || 0 }} article(s)
                    </td>
                    <td class="p-4 text-primary-400 font-semibold text-sm">
                      {{ order.total?.toFixed(3) }} TND
                    </td>
                    <td class="p-4">
                      <select
                        [value]="order.status"
                        (change)="updateStatus(order, $event)"
                        [class]="getStatusSelectClass(order.status)"
                        class="border rounded-lg px-2 py-1 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary-500 cursor-pointer"
                      >
                        @for (s of statuses.slice(1); track s.value) {
                          <option
                            [value]="s.value"
                            [selected]="order.status === s.value"
                          >
                            {{ s.label }}
                          </option>
                        }
                      </select>
                    </td>
                    <td class="p-4 text-dark-400 text-xs">
                      {{ order.createdAt | date: "dd/MM/yy HH:mm" }}
                    </td>
                    <td class="p-4">
                      <div class="flex items-center gap-2">
                        <button
                          (click)="viewOrderDetails(order)"
                          class="text-xs text-primary-400 hover:text-primary-300 font-medium hover:underline"
                        >
                          Détails
                        </button>
                        <button
                          (click)="askDeleteOrder(order)"
                          title="Supprimer la commande"
                          class="w-7 h-7 flex items-center justify-center rounded-lg bg-dark-700 hover:bg-red-600 text-dark-400 hover:text-white transition-colors"
                        >
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                }
                @if (orders.length === 0) {
                  <tr>
                    <td colspan="8" class="p-12 text-center text-dark-500">
                      Aucune commande trouvée
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          @if (totalPages > 1) {
            <div
              class="flex items-center justify-between p-4 border-t border-dark-800"
            >
              <p class="text-dark-400 text-sm">
                Page {{ currentPage + 1 }} sur {{ totalPages }}
              </p>
              <div class="flex gap-2">
                <button
                  (click)="changePage(currentPage - 1)"
                  [disabled]="currentPage === 0"
                  class="px-3 py-1.5 rounded-lg bg-dark-800 text-dark-300 disabled:opacity-40 hover:bg-dark-700 text-sm"
                >
                  ← Précédent
                </button>
                <button
                  (click)="changePage(currentPage + 1)"
                  [disabled]="currentPage >= totalPages - 1"
                  class="px-3 py-1.5 rounded-lg bg-dark-800 text-dark-300 disabled:opacity-40 hover:bg-dark-700 text-sm"
                >
                  Suivant →
                </button>
              </div>
            </div>
          }
        }
      </div>
    </div>

    <!-- Delete Order Confirmation Modal -->
    @if (deletingOrder) {
      <div class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-white/75 backdrop-blur-sm"
           (click)="deletingOrder = null">
        <div class="glass rounded-2xl p-6 max-w-sm w-full" (click)="$event.stopPropagation()">
          <h3 class="text-lg font-bold text-dark-100 mb-2">Supprimer la commande ?</h3>
          <p class="text-dark-400 text-sm mb-6">
            La commande
            <span class="text-dark-100 font-mono font-semibold">#{{ deletingOrder.orderNumber }}</span>
            sera définitivement supprimée. Cette action est irréversible.
          </p>
          <div class="flex gap-3">
            <button
              class="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-colors disabled:opacity-50"
              [disabled]="deletingOrderInProgress"
              (click)="confirmDeleteOrder()">
              {{ deletingOrderInProgress ? 'Suppression...' : 'Supprimer' }}
            </button>
            <button class="flex-1 py-2 rounded-xl bg-dark-700 hover:bg-dark-600 text-dark-300 text-sm transition-colors"
                    (click)="deletingOrder = null">Annuler</button>
          </div>
        </div>
      </div>
    }

    <!-- Order Details Modal -->
    @if (selectedOrder) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/75 backdrop-blur-sm"
        (click)="selectedOrder = null"
      >
        <div
          class="glass rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          (click)="$event.stopPropagation()"
        >
          <div
            class="p-6 border-b border-dark-800 flex items-center justify-between sticky top-0 bg-dark-900/95 backdrop-blur-sm"
          >
            <div>
              <h2 class="text-xl font-bold text-dark-100">
                Commande #{{ selectedOrder.orderNumber }}
              </h2>
              <p class="text-dark-400 text-sm mt-0.5">
                {{ selectedOrder.createdAt | date: "dd/MM/yyyy à HH:mm" }}
              </p>
            </div>
            <button
              (click)="selectedOrder = null"
              class="text-dark-400 hover:text-dark-100"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <button
              (click)="askDeleteOrder(selectedOrder)"
              title="Supprimer la commande"
              class="w-8 h-8 flex items-center justify-center rounded-lg bg-dark-700 hover:bg-red-600 text-dark-400 hover:text-white transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
          <div class="p-6 space-y-6">
            <!-- Status -->
            <div class="flex items-center gap-4">
              <span
                [class]="getStatusBadgeClass(selectedOrder.status)"
                class="text-sm px-3 py-1.5 rounded-xl font-medium"
              >
                {{ getStatusLabel(selectedOrder.status) }}
              </span>
              <select
                [value]="selectedOrder.status"
                (change)="updateStatus(selectedOrder, $event)"
                class="bg-dark-800 border border-dark-700 rounded-xl px-3 py-1.5 text-dark-100 text-sm focus:border-primary-500 focus:outline-none"
              >
                @for (s of statuses.slice(1); track s.value) {
                  <option [value]="s.value">{{ s.label }}</option>
                }
              </select>
            </div>

            <!-- Customer Info -->
            <div class="grid grid-cols-2 gap-6">
              <div class="bg-dark-800/50 rounded-xl p-4">
                <h3 class="text-dark-400 text-xs uppercase tracking-wider mb-3">
                  Client
                </h3>
                <p class="text-dark-100 font-medium">
                  {{ selectedOrder.shippingFullName }}
                </p>
                <p class="text-dark-300 text-sm mt-1">
                  📞 {{ selectedOrder.shippingPhone }}
                </p>
                @if (selectedOrder.isGuest) {
                  <span
                    class="text-xs bg-dark-700 text-dark-400 px-2 py-0.5 rounded mt-2 inline-block"
                    >Commande invité</span
                  >
                }
              </div>
              <div class="bg-dark-800/50 rounded-xl p-4">
                <h3 class="text-dark-400 text-xs uppercase tracking-wider mb-3">
                  Livraison
                </h3>
                <p class="text-dark-100 text-sm">
                  {{ selectedOrder.shippingAddress }}
                </p>
                <p class="text-dark-300 text-sm">
                  {{ selectedOrder.shippingCity }},
                  {{ selectedOrder.shippingGovernorate }}
                </p>
                @if (selectedOrder.shippingNotes) {
                  <p class="text-dark-400 text-xs mt-2 italic">
                    Note: {{ selectedOrder.shippingNotes }}
                  </p>
                }
              </div>
            </div>

            <!-- Order Items -->
            <div>
              <h3 class="text-dark-400 text-xs uppercase tracking-wider mb-3">
                Articles commandés
              </h3>
              <div class="space-y-3">
                @for (item of selectedOrder.items; track item.id) {
                  <div
                    class="flex items-center gap-4 bg-dark-800/50 rounded-xl p-3"
                  >
                    @if (item.productImage) {
                      <img
                        [src]="item.productImage"
                        [alt]="item.productName"
                        class="w-12 h-12 rounded-lg object-cover shrink-0"
                      />
                    } @else {
                      <div
                        class="w-12 h-12 bg-dark-700 rounded-lg flex items-center justify-center shrink-0"
                      >
                        <svg
                          class="w-6 h-6 text-dark-500"
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
                      </div>
                    }
                    <div class="flex-1">
                      <p class="text-dark-100 text-sm font-medium">
                        {{ item.productName }}
                      </p>
                      <div class="flex gap-3 mt-1">
                        @if (item.sizeName) {
                          <span class="text-dark-500 text-xs"
                            >Taille: {{ item.sizeName }}</span
                          >
                        }
                        @if (item.colorName) {
                          <span class="text-dark-500 text-xs"
                            >Couleur: {{ item.colorName }}</span
                          >
                        }
                      </div>
                    </div>
                    <div class="text-right shrink-0">
                      <p class="text-dark-100 text-sm">x{{ item.quantity }}</p>
                      <p class="text-primary-400 text-sm font-semibold">
                        {{ item.totalPrice?.toFixed(3) }} TND
                      </p>
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Totals -->
            <div class="bg-dark-800/50 rounded-xl p-4 space-y-2">
              <div class="flex justify-between text-dark-300 text-sm">
                <span>Sous-total</span>
                <span>{{ selectedOrder.subtotal?.toFixed(3) }} TND</span>
              </div>
              <div class="flex justify-between text-dark-300 text-sm">
                <span>Livraison</span>
                <span>{{
                  selectedOrder.shippingCost > 0
                    ? selectedOrder.shippingCost?.toFixed(3) + " TND"
                    : "Gratuite"
                }}</span>
              </div>
              @if (selectedOrder.discount > 0) {
                <div class="flex justify-between text-green-400 text-sm">
                  <span>Réduction
                    @if (selectedOrder.couponCode) {
                      <code class="ml-1 px-1.5 py-0.5 bg-green-900/40 rounded text-xs font-mono">{{ selectedOrder.couponCode }}</code>
                    }
                  </span>
                  <span>-{{ selectedOrder.discount?.toFixed(3) }} TND</span>
                </div>
              }
              <div
                class="flex justify-between text-dark-100 font-bold text-base pt-2 border-t border-dark-700"
              >
                <span>Total</span>
                <span>{{ selectedOrder.total?.toFixed(3) }} TND</span>
              </div>
            </div>

            @if (selectedOrder.notes) {
              <div
                class="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4"
              >
                <p class="text-yellow-400 text-sm font-medium mb-1">
                  Note du client
                </p>
                <p class="text-dark-300 text-sm">{{ selectedOrder.notes }}</p>
              </div>
            }
          </div>
        </div>
      </div>
    }
  `,
})
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = [];
  selectedOrder: Order | null = null;
  loading = false;
  deletingOrder: Order | null = null;
  deletingOrderInProgress = false;
  selectedStatus = "";
  searchQuery = "";
  currentPage = 0;
  totalPages = 0;
  totalElements = 0;
  statusCounts: Record<string, number> = {};

  statuses = [
    { value: "", label: "Toutes", activeClass: "bg-white text-dark-950" },
    {
      value: "PENDING",
      label: "En attente",
      activeClass: "bg-yellow-500 text-dark-950",
    },
    {
      value: "CONFIRMED",
      label: "Confirmé",
      activeClass: "bg-blue-500 text-dark-100",
    },
    {
      value: "PREPARING",
      label: "Préparation",
      activeClass: "bg-orange-500 text-dark-100",
    },
    {
      value: "SHIPPED",
      label: "Expédié",
      activeClass: "bg-purple-500 text-dark-100",
    },
    {
      value: "DELIVERED",
      label: "Livré",
      activeClass: "bg-green-500 text-dark-100",
    },
    {
      value: "CANCELLED",
      label: "Annulé",
      activeClass: "bg-red-500 text-dark-100",
    },
  ];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
    this.loadStatusCounts();
  }

  loadStatusCounts(): void {
    // load counts for all statuses from dashboard endpoint or order lists
    this.statuses.slice(1).forEach((s) => {
      this.orderService
        .getOrdersByStatus(s.value as OrderStatus, 0, 1)
        .subscribe({
          next: (r) => (this.statusCounts[s.value] = r.totalElements),
        });
    });
  }

  loadOrders(): void {
    this.loading = true;
    let obs;

    if (this.searchQuery.trim()) {
      obs = this.orderService.searchOrders(
        this.searchQuery.trim(),
        this.currentPage,
        20,
      );
    } else if (this.selectedStatus) {
      obs = this.orderService.getOrdersByStatus(
        this.selectedStatus as OrderStatus,
        this.currentPage,
        20,
      );
    } else {
      obs = this.orderService.getAllOrders(this.currentPage, 20);
    }

    obs.subscribe({
      next: (r) => {
        this.orders = r.content;
        this.totalPages = r.totalPages;
        this.totalElements = r.totalElements;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  filterByStatus(status: string): void {
    this.selectedStatus = status;
    this.currentPage = 0;
    this.searchQuery = "";
    this.loadOrders();
  }

  search(): void {
    this.currentPage = 0;
    this.selectedStatus = "";
    this.loadOrders();
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.loadOrders();
  }

  updateStatus(order: Order, event: any): void {
    const status = event.target.value as OrderStatus;
    this.orderService.updateOrderStatus(order.id, status).subscribe({
      next: (updated) => {
        order.status = updated.status;
        if (this.selectedOrder?.id === order.id) {
          this.selectedOrder = updated;
        }
        this.loadStatusCounts();
      },
    });
  }

  viewOrderDetails(order: Order): void {
    this.orderService.getOrderById(order.id).subscribe({
      next: (o) => (this.selectedOrder = o),
    });
  }

  askDeleteOrder(order: Order): void {
    this.deletingOrder = order;
  }

  confirmDeleteOrder(): void {
    if (!this.deletingOrder) return;
    this.deletingOrderInProgress = true;
    this.orderService.deleteOrder(this.deletingOrder.id).subscribe({
      next: () => {
        this.orders = this.orders.filter(o => o.id !== this.deletingOrder!.id);
        if (this.selectedOrder?.id === this.deletingOrder!.id) {
          this.selectedOrder = null;
        }
        this.totalElements = Math.max(0, this.totalElements - 1);
        this.deletingOrderInProgress = false;
        this.deletingOrder = null;
      },
      error: () => {
        this.deletingOrderInProgress = false;
        this.deletingOrder = null;
      }
    });
  }

  getStatusLabel(status: string): string {
    return this.statuses.find((s) => s.value === status)?.label || status;
  }

  getStatusBadgeClass(status: string): string {
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

  getStatusSelectClass(status: string): string {
    const map: Record<string, string> = {
      PENDING: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
      CONFIRMED: "bg-blue-500/10 border-blue-500/30 text-blue-400",
      PREPARING: "bg-orange-500/10 border-orange-500/30 text-orange-400",
      SHIPPED: "bg-purple-500/10 border-purple-500/30 text-purple-400",
      DELIVERED: "bg-green-500/10 border-green-500/30 text-green-400",
      CANCELLED: "bg-red-500/10 border-red-500/30 text-red-400",
    };
    return map[status] || "bg-dark-800 border-dark-700 text-dark-300";
  }
}
