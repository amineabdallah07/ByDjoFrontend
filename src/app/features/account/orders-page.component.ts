import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { I18nService } from "../../core/services/i18n.service";
import { Order, OrderStatus } from '../../core/models/interfaces';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="pt-24 pb-20">
      <div class="page-container">
        <div class="flex items-center gap-4 mb-8">
          <a routerLink="/account" class="text-dark-400 hover:text-dark-100 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </a>
          <h1 class="text-3xl font-black text-dark-100">MES COMMANDES</h1>
        </div>

        <div class="space-y-4">
          @for (order of orders; track order.id) {
            <div class="glass rounded-2xl overflow-hidden">
              <!-- En-tête commande — cliquable pour expand -->
              <button
                (click)="toggleOrder(order.id)"
                class="w-full p-6 text-left hover:bg-white/[0.02] transition-colors"
              >
                <div class="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span class="text-dark-500 text-sm">Commande</span>
                    <p class="text-dark-100 font-bold text-lg">#{{ order.orderNumber }}</p>
                  </div>
                  <div class="flex items-center gap-3">
                    <div [class]="getStatusClass(order.status)">
                      {{ getStatusLabel(order.status) }}
                    </div>
                    <svg
                      class="w-5 h-5 text-dark-400 transition-transform duration-300"
                      [class.rotate-180]="expandedOrders().includes(order.id)"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </div>
                </div>
                <div class="flex items-center justify-between text-sm mt-3">
                  <span class="text-dark-400">{{ order.createdAt | date:'dd MMM yyyy' }}</span>
                  <span class="text-primary-400 font-bold">{{ order.total.toFixed(3) }} TND</span>
                </div>
              </button>

              <!-- Bouton annuler (PENDING uniquement) -->
              @if (order.status === 'PENDING') {
                <div class="px-6 pb-4">
                  <button
                    (click)="confirmCancel(order)"
                    class="w-full py-2.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-sm font-medium transition-colors"
                  >
                    Annuler la commande
                  </button>
                </div>
              }

              <!-- Détail des articles — expandable -->
              @if (expandedOrders().includes(order.id) && order.items && order.items.length > 0) {
                <div class="border-t border-dark-800 px-6 pb-5 pt-4 animate-fade-in">
                  <p class="text-dark-400 text-xs uppercase tracking-wider mb-3 font-medium">Articles commandés</p>
                  <div class="space-y-3">
                    @for (item of order.items; track item.id) {
                      <div class="flex items-center gap-4">
                        <div class="w-12 h-14 bg-dark-800 rounded-lg shrink-0 overflow-hidden">
                          @if (item.productImage) {
                            <img
                              [src]="item.productImage"
                              [alt]="item.productName"
                              class="w-full h-full object-cover"
                              (error)="onImgError($event)"
                            />
                          } @else {
                            <div class="w-full h-full flex items-center justify-center text-dark-600">
                              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                              </svg>
                            </div>
                          }
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="text-dark-100 font-medium text-sm line-clamp-1">{{ item.productName }}</p>
                          <div class="flex gap-2 text-dark-500 text-xs mt-0.5">
                            @if (item.sizeName) { <span>Taille : {{ item.sizeName }}</span> }
                            @if (item.colorName) { <span>Couleur : {{ item.colorName }}</span> }
                            <span>x{{ item.quantity }}</span>
                          </div>
                        </div>
                        <span class="text-dark-300 text-sm font-medium shrink-0">
                          {{ item.totalPrice.toFixed(3) }} TND
                        </span>
                      </div>
                    }
                  </div>
                  <!-- Recap totaux -->
                  <div class="mt-4 pt-4 border-t border-dark-800 flex justify-between items-center text-sm">
                    <span class="text-dark-400">
                      {{ order.items.length }} article{{ order.items.length > 1 ? 's' : '' }}
                    </span>
                    <span class="text-primary-400 font-bold">{{ order.total.toFixed(3) }} TND</span>
                  </div>
                </div>
              }
            </div>
          }

          @if (orders.length === 0) {
            <div class="text-center py-16">
              <p class="text-dark-400">{{ i18n.t().account.noOrders }} pour le moment</p>
              <a routerLink="/shop" class="btn-primary mt-4 inline-block">Commencer vos achats</a>
            </div>
          }
        </div>
      </div>
    </div>

    <!-- Modal confirmation annulation -->
    @if (orderToCancel) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/75 backdrop-blur-sm"
        (click)="orderToCancel = null"
      >
        <div
          class="glass rounded-2xl w-full max-w-sm p-6 space-y-5"
          (click)="$event.stopPropagation()"
        >
          <div class="text-center">
            <div class="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </div>
            <h3 class="text-dark-100 text-lg font-bold mb-1">Annuler la commande ?</h3>
            <p class="text-dark-400 text-sm">
              Commande <span class="text-dark-100 font-medium">#{{ orderToCancel.orderNumber }}</span> — cette action est irréversible.
            </p>
          </div>
          <div class="flex gap-3">
            <button
              (click)="orderToCancel = null"
              class="flex-1 py-2.5 rounded-xl bg-dark-800 text-dark-300 hover:bg-dark-700 text-sm font-medium transition-colors"
            >
              Garder
            </button>
            <button
              (click)="cancelOrder()"
              [disabled]="cancelling"
              class="flex-1 py-2.5 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 text-sm font-medium transition-colors disabled:opacity-50"
            >
              {{ cancelling ? '...' : 'Annuler' }}
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class OrdersPageComponent implements OnInit {
  i18n = inject(I18nService);
  orders: Order[] = [];
  expandedOrders = signal<number[]>([]);
  orderToCancel: Order | null = null;
  cancelling = false;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getMyOrders().subscribe({
      next: (response) => this.orders = response.content
    });
  }

  toggleOrder(orderId: number): void {
    const current = this.expandedOrders();
    if (current.includes(orderId)) {
      this.expandedOrders.set(current.filter(id => id !== orderId));
    } else {
      this.expandedOrders.set([...current, orderId]);
    }
  }

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }

  getStatusLabel(status: OrderStatus): string {
    const labels: Record<OrderStatus, string> = {
      [OrderStatus.PENDING]: 'En attente',
      [OrderStatus.CONFIRMED]: 'Confirmée',
      [OrderStatus.PREPARING]: 'En préparation',
      [OrderStatus.SHIPPED]: 'Expédiée',
      [OrderStatus.DELIVERED]: 'Livrée',
      [OrderStatus.CANCELLED]: 'Annulée'
    };
    return labels[status] || status;
  }

  getStatusClass(status: OrderStatus): string {
    const classes: Record<string, string> = {
      PENDING: 'badge-primary',
      CONFIRMED: 'badge-primary',
      PREPARING: 'badge-primary',
      SHIPPED: 'badge-primary',
      DELIVERED: 'badge-success',
      CANCELLED: 'badge-danger'
    };
    return classes[status] || 'badge';
  }

  confirmCancel(order: Order): void {
    this.orderToCancel = order;
  }

  cancelOrder(): void {
    if (!this.orderToCancel) return;
    this.cancelling = true;
    this.orderService.cancelOrder(this.orderToCancel.id).subscribe({
      next: (updated) => {
        const idx = this.orders.findIndex(o => o.id === updated.id);
        if (idx !== -1) this.orders[idx] = updated;
        this.orderToCancel = null;
        this.cancelling = false;
      },
      error: () => {
        this.cancelling = false;
        this.orderToCancel = null;
      }
    });
  }
}
