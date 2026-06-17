import { Component, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { QrService } from "../../../core/services/qr.service";
import { QrOrderItem } from "../../../core/models/interfaces";

const QR_API_BASE = "https://api.qrserver.com/v1/create-qr-code";

@Component({
  selector: "app-admin-qr-orders",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-3xl font-black text-dark-100">Commandes QR Code</h1>
        <p class="text-dark-400 text-sm mt-1">
          Tous les articles commandés avec un contenu QR
        </p>
      </div>

      <div class="glass rounded-2xl overflow-hidden">
        @if (loading()) {
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
                  <th class="p-4 text-dark-400 text-xs font-medium uppercase tracking-wider">N° QR</th>
                  <th class="p-4 text-dark-400 text-xs font-medium uppercase tracking-wider">Commande</th>
                  <th class="p-4 text-dark-400 text-xs font-medium uppercase tracking-wider">Produit</th>
                  <th class="p-4 text-dark-400 text-xs font-medium uppercase tracking-wider">Client</th>
                  <th class="p-4 text-dark-400 text-xs font-medium uppercase tracking-wider">Type</th>
                  <th class="p-4 text-dark-400 text-xs font-medium uppercase tracking-wider">Contenu</th>
                  <th class="p-4 text-dark-400 text-xs font-medium uppercase tracking-wider">Date</th>
                  <th class="p-4 text-dark-400 text-xs font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (item of items(); track item.id) {
                  <tr class="border-b border-dark-800/50 hover:bg-dark-800/20 transition-colors">
                    <td class="p-4 text-primary-400 font-bold text-sm">#{{ item.qrCodeId || '—' }}</td>
                    <td class="p-4 text-dark-100 font-medium text-sm">{{ item.orderNumber }}</td>
                    <td class="p-4 text-dark-300 text-sm">{{ item.productName }}</td>
                    <td class="p-4 text-dark-300 text-sm">{{ item.customerName }}</td>
                    <td class="p-4">
                      <span
                        [class]="'text-xs px-2 py-1 rounded-lg font-medium ' + (item.qrType === 'PHOTO' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400')"
                      >
                        {{ item.qrType === 'PHOTO' ? '📷 Photo' : '🔗 Lien' }}
                      </span>
                    </td>
                    <td class="p-4 text-dark-300 text-sm max-w-xs truncate">
                      @if (item.qrType === 'PHOTO') {
                        <a [href]="item.content" target="_blank" class="text-primary-400 underline">Voir photo</a>
                      } @else {
                        <a [href]="item.content" target="_blank" class="text-primary-400 underline truncate block">{{ item.content }}</a>
                      }
                    </td>
                    <td class="p-4">
                      <code class="text-xs bg-dark-800 px-2 py-1 rounded text-dark-300">{{ item.qrCode.slice(0, 8) }}...</code>
                    </td>
                    <td class="p-4 text-dark-400 text-sm">{{ item.createdAt | date:'short' }}</td>
                    <td class="p-4">
                      <button (click)="openDetail(item)"
                        class="text-dark-400 hover:text-primary-400 transition-colors p-1.5 hover:bg-primary-500/10 rounded-lg"
                        title="Détails">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                }
                @if (items().length === 0) {
                  <tr>
                    <td colspan="9" class="p-12 text-center text-dark-500">
                      Aucune commande QR trouvée
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>

    <!-- Détails Modal -->
    @if (selectedItem()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/75 backdrop-blur-sm"
        (click)="selectedItem.set(null)">
        <div class="glass rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
          (click)="$event.stopPropagation()">
          <div class="p-6 border-b border-dark-800 flex items-center justify-between sticky top-0 bg-dark-900/95 backdrop-blur-sm">
            <h2 class="text-xl font-bold text-dark-100">Détails QR</h2>
            <button (click)="selectedItem.set(null)"
              class="text-dark-400 hover:text-dark-100 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          @let item = selectedItem()!;
          <div class="p-6 space-y-4">
            <div class="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p class="text-dark-500 text-xs uppercase tracking-wider">QR N°</p>
                <p class="text-dark-100 font-bold text-lg">#{{ item.qrCodeId || '?' }}</p>
              </div>
              <div>
                <p class="text-dark-500 text-xs uppercase tracking-wider">Commande</p>
                <p class="text-dark-100 font-medium">{{ item.orderNumber }}</p>
              </div>
              <div>
                <p class="text-dark-500 text-xs uppercase tracking-wider">Client</p>
                <p class="text-dark-100 font-medium">{{ item.customerName }}</p>
              </div>
              <div>
                <p class="text-dark-500 text-xs uppercase tracking-wider">Produit</p>
                <p class="text-dark-100 font-medium">{{ item.productName }}</p>
              </div>
              <div>
                <p class="text-dark-500 text-xs uppercase tracking-wider">Date</p>
                <p class="text-dark-100 font-medium">{{ item.createdAt | date:'dd/MM/yyyy HH:mm' }}</p>
              </div>
            </div>

            <hr class="border-dark-800"/>

            <!-- Contenu client -->
            <div>
              <p class="text-dark-500 text-xs uppercase tracking-wider mb-2">
                {{ item.qrType === 'PHOTO' ? '📷 Photo envoyée' : '🔗 Lien envoyé' }}
              </p>
              @if (item.qrType === 'PHOTO') {
                <img [src]="item.content" class="w-full rounded-xl border border-dark-700 max-h-64 object-contain bg-dark-900"/>
              } @else {
                <a [href]="item.content" target="_blank" rel="noopener noreferrer"
                  class="text-primary-400 underline break-all text-sm">{{ item.content }}</a>
              }
            </div>

            <!-- QR Code qui pointe directement vers le contenu client -->
            <div class="text-center">
              <p class="text-dark-500 text-xs uppercase tracking-wider mb-3">QR Code (contient le lien du client)</p>
              <div class="inline-block bg-white p-3 rounded-xl">
                <img [src]="qrImageUrl(item.content)"
                  alt="QR Code"
                  class="w-48 h-48 mx-auto" />
              </div>
              <div class="flex gap-3 justify-center mt-4">
                <a [href]="qrImageUrl(item.content)" download="qr-{{ item.qrCode.slice(0,8) }}.png"
                  class="btn-primary text-sm flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  Télécharger QR
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class AdminQrOrdersComponent implements OnInit {
  items = signal<QrOrderItem[]>([]);
  loading = signal(false);
  selectedItem = signal<QrOrderItem | null>(null);

  constructor(private qrService: QrService) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.loading.set(true);
    this.qrService.getAllQrOrders().subscribe({
      next: (res) => {
        this.items.set(res.data || []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  openDetail(item: QrOrderItem): void {
    this.selectedItem.set(item);
  }

  qrImageUrl(content: string): string {
    return `${QR_API_BASE}?size=300x300&data=${encodeURIComponent(content)}`;
  }
}
