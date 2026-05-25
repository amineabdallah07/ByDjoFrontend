import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AdminService } from "../../../core/services/admin.service";
import { OrderService } from "../../../core/services/order.service";

@Component({
  selector: "app-admin-customers",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 class="text-3xl font-black text-dark-100">Clients</h1>
          <p class="text-dark-400 text-sm mt-1">
            {{ totalElements }} client(s) inscrit(s)
          </p>
        </div>
      </div>

      <!-- Search -->
      <div class="glass rounded-2xl p-4">
        <div class="relative">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (keyup.enter)="search()"
            (ngModelChange)="onSearchChange($event)"
            placeholder="Rechercher par nom, téléphone, email..."
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
      </div>

      <!-- Customers Table -->
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
                    Email
                  </th>
                  <th
                    class="p-4 text-dark-400 text-xs font-medium uppercase tracking-wider"
                  >
                    Inscrit le
                  </th>
                  <th
                    class="p-4 text-dark-400 text-xs font-medium uppercase tracking-wider"
                  >
                    Statut
                  </th>
                  <th
                    class="p-4 text-dark-400 text-xs font-medium uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                @for (customer of customers; track customer.id) {
                  <tr
                    class="border-b border-dark-800/50 hover:bg-dark-800/20 transition-colors"
                  >
                    <td class="p-4">
                      <div class="flex items-center gap-3">
                        <div
                          class="w-10 h-10 bg-primary-500/10 rounded-full flex items-center justify-center shrink-0"
                        >
                          <span
                            class="text-primary-400 font-bold text-sm uppercase"
                          >
                            {{ (customer.firstName || "?")[0]
                            }}{{ (customer.lastName || "?")[0] }}
                          </span>
                        </div>
                        <div>
                          <p class="text-dark-100 font-medium text-sm">
                            {{ customer.firstName }} {{ customer.lastName }}
                          </p>
                          @if (customer.phoneVerified) {
                            <span class="text-xs text-green-400"
                              >✓ Vérifié</span
                            >
                          } @else {
                            <span class="text-xs text-dark-500"
                              >Non vérifié</span
                            >
                          }
                        </div>
                      </div>
                    </td>
                    <td class="p-4 text-dark-300 text-sm">
                      {{ customer.phone }}
                    </td>
                    <td class="p-4 text-dark-400 text-sm">
                      {{ customer.email || "-" }}
                    </td>
                    <td class="p-4 text-dark-400 text-sm">
                      {{ customer.createdAt | date: "dd/MM/yyyy" }}
                    </td>
                    <td class="p-4">
                      <span
                        [class]="
                          customer.active
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        "
                        class="text-xs px-2 py-1 rounded-lg font-medium"
                      >
                        {{ customer.active ? "Actif" : "Bloqué" }}
                      </span>
                    </td>
                    <td class="p-4">
                      <div class="flex items-center gap-2">
                        <button
                          (click)="viewDetails(customer)"
                          class="text-xs text-primary-400 hover:text-primary-300 font-medium hover:underline"
                        >
                          Voir
                        </button>
                        <span class="text-dark-700">|</span>
                        <button
                          (click)="toggleActive(customer)"
                          [class]="
                            customer.active
                              ? 'text-red-400 hover:text-red-300'
                              : 'text-green-400 hover:text-green-300'
                          "
                          class="text-xs font-medium hover:underline"
                        >
                          {{ customer.active ? "Bloquer" : "Débloquer" }}
                        </button>
                        <span class="text-dark-700">|</span>
                        <button
                          (click)="confirmDelete(customer)"
                          class="text-xs text-red-500 hover:text-red-400 font-medium hover:underline"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                }
                @if (customers.length === 0) {
                  <tr>
                    <td colspan="6" class="p-12 text-center text-dark-500">
                      Aucun client trouvé
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

    <!-- Customer Detail Modal -->
    @if (selectedCustomer) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/75 backdrop-blur-sm"
        (click)="selectedCustomer = null"
      >
        <div
          class="glass rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
          (click)="$event.stopPropagation()"
        >
          <div
            class="p-6 border-b border-dark-800 flex items-center justify-between"
          >
            <h2 class="text-xl font-bold text-dark-100">Détail du client</h2>
            <button
              (click)="selectedCustomer = null"
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
          </div>
          <div class="p-6 space-y-6">
            <!-- Avatar & Name -->
            <div class="flex items-center gap-4">
              <div
                class="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center"
              >
                <span class="text-primary-400 font-bold text-xl uppercase">
                  {{ (selectedCustomer.firstName || "?")[0]
                  }}{{ (selectedCustomer.lastName || "?")[0] }}
                </span>
              </div>
              <div>
                <p class="text-dark-100 text-lg font-bold">
                  {{ selectedCustomer.firstName }}
                  {{ selectedCustomer.lastName }}
                </p>
                <p class="text-dark-400 text-sm">
                  Client depuis
                  {{ selectedCustomer.createdAt | date: "MMMM yyyy" }}
                </p>
              </div>
            </div>

            <!-- Contact Info -->
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-dark-800/50 rounded-xl p-4">
                <p class="text-dark-400 text-xs mb-1">Téléphone</p>
                <p class="text-dark-100 font-medium">
                  {{ selectedCustomer.phone }}
                </p>
              </div>
              <div class="bg-dark-800/50 rounded-xl p-4">
                <p class="text-dark-400 text-xs mb-1">Email</p>
                <p class="text-dark-100 font-medium">
                  {{ selectedCustomer.email || "Non renseigné" }}
                </p>
              </div>
            </div>

            <!-- Stats -->
            @if (customerDetail) {
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-primary-500/10 rounded-xl p-4 text-center">
                  <p class="text-2xl font-bold text-primary-400">
                    {{ customerDetail.orderCount }}
                  </p>
                  <p class="text-dark-400 text-xs mt-1">Commandes</p>
                </div>
                <div class="bg-green-500/10 rounded-xl p-4 text-center">
                  <p class="text-2xl font-bold text-green-400">
                    {{ customerDetail.totalSpent?.toFixed(0) }}
                  </p>
                  <p class="text-dark-400 text-xs mt-1">TND dépensés</p>
                </div>
              </div>
            }

            <!-- Actions -->
            <div class="flex gap-3">
              <button
                (click)="
                  toggleActive(selectedCustomer); selectedCustomer = null
                "
                [class]="
                  selectedCustomer.active
                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                    : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                "
                class="flex-1 py-3 rounded-xl font-medium transition-colors text-sm"
              >
                {{
                  selectedCustomer.active
                    ? "🚫 Bloquer ce client"
                    : "✅ Débloquer ce client"
                }}
              </button>
              <button
                (click)="confirmDelete(selectedCustomer)"
                class="py-3 px-4 rounded-xl bg-red-600/20 text-red-400 hover:bg-red-600/30 font-medium transition-colors text-sm"
              >
                🗑️ Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>
    }
    <!-- Delete Confirmation Modal -->
    @if (customerToDelete) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/75 backdrop-blur-sm"
        (click)="customerToDelete = null"
      >
        <div
          class="glass rounded-2xl w-full max-w-sm p-6 space-y-5"
          (click)="$event.stopPropagation()"
        >
          <div class="text-center">
            <div class="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </div>
            <h3 class="text-dark-100 text-lg font-bold mb-1">Supprimer ce client ?</h3>
            <p class="text-dark-400 text-sm">
              {{ customerToDelete.firstName }} {{ customerToDelete.lastName }} sera définitivement supprimé.
              Cette action est irréversible.
            </p>
          </div>
          <div class="flex gap-3">
            <button
              (click)="customerToDelete = null"
              class="flex-1 py-2.5 rounded-xl bg-dark-800 text-dark-300 hover:bg-dark-700 text-sm font-medium transition-colors"
            >
              Annuler
            </button>
            <button
              (click)="deleteCustomer()"
              class="flex-1 py-2.5 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 text-sm font-medium transition-colors"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class AdminCustomersComponent implements OnInit {
  customers: any[] = [];
  selectedCustomer: any = null;
  customerDetail: any = null;
  customerToDelete: any = null;
  loading = false;
  searchQuery = "";
  currentPage = 0;
  totalPages = 0;
  totalElements = 0;
  private searchTimeout: any;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.loading = true;
    this.adminService
      .getCustomers(this.currentPage, 20, this.searchQuery || undefined)
      .subscribe({
        next: (r) => {
          this.customers = r.content;
          this.totalPages = r.totalPages;
          this.totalElements = r.totalElements;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  onSearchChange(value: string): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => this.search(), 400);
  }

  search(): void {
    this.currentPage = 0;
    this.loadCustomers();
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.loadCustomers();
  }

  viewDetails(customer: any): void {
    this.selectedCustomer = customer;
    this.customerDetail = null;
    this.adminService.getCustomerDetail(customer.id).subscribe({
      next: (detail) => (this.customerDetail = detail),
    });
  }

  toggleActive(customer: any): void {
    this.adminService.toggleCustomerActive(customer.id).subscribe({
      next: () => {
        customer.active = !customer.active;
      },
    });
  }

  confirmDelete(customer: any): void {
    this.selectedCustomer = null;
    this.customerToDelete = customer;
  }

  deleteCustomer(): void {
    if (!this.customerToDelete) return;
    const id = this.customerToDelete.id;
    this.adminService.deleteCustomer(id).subscribe({
      next: () => {
        this.customers = this.customers.filter((c) => c.id !== id);
        this.totalElements--;
        this.customerToDelete = null;
      },
      error: () => {
        this.customerToDelete = null;
      },
    });
  }
}
