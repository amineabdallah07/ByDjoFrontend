import { Component, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ApiService } from "../../../core/services/api.service";
import { Tshirt } from "../../../core/models/interfaces";

@Component({
  selector: "app-admin-tshirts",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl">
      <h1 class="text-2xl font-black text-dark-100 mb-6">T-shirts QR</h1>

      <div class="glass rounded-2xl p-6 mb-6">
        <h2 class="text-lg font-bold text-dark-100 mb-4">Créer un T-shirt</h2>
        <div class="flex gap-3">
          <input
            [(ngModel)]="newCode"
            placeholder="Ex: TSHIRT-001"
            class="flex-1 bg-dark-800 border border-dark-700 rounded-xl px-4 py-2.5 text-dark-100 placeholder-dark-500 focus:outline-none focus:border-primary-500/50"
          />
          <button
            (click)="create()"
            [disabled]="!newCode().trim() || creating()"
            class="px-6 py-2.5 bg-primary-500 text-dark-950 font-semibold rounded-xl hover:bg-primary-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {{ creating() ? "Création..." : "Créer" }}
          </button>
        </div>
        @if (createMsg()) {
          <p
            class="mt-3 text-sm"
            [class.text-green-400]="createSuccess()"
            [class.text-red-400]="!createSuccess()"
          >
            {{ createMsg() }}
          </p>
        }
      </div>

      <div class="glass rounded-2xl p-6">
        <h2 class="text-lg font-bold text-dark-100 mb-4">Tous les T-shirts</h2>
        @if (loading()) {
          <div class="flex justify-center py-8">
            <div class="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        } @else if (tshirts().length === 0) {
          <p class="text-dark-400 text-center py-8">
            Aucun T-shirt pour le moment.
          </p>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="text-dark-500 text-xs uppercase tracking-wider border-b border-dark-700">
                  <th class="text-left py-3 px-2">Code</th>
                  <th class="text-left py-3 px-2">Propriétaire</th>
                  <th class="text-center py-3 px-2">Scans</th>
                  <th class="text-right py-3 px-2">QR Code</th>
                </tr>
              </thead>
              <tbody>
                @for (t of tshirts(); track t.id) {
                  <tr class="border-b border-dark-800/50 hover:bg-dark-800/30">
                    <td class="py-3 px-2 font-mono text-primary-400 font-bold">
                      {{ t.code }}
                    </td>
                    <td class="py-3 px-2 text-dark-300">
                      {{ t.ownerId || "—" }}
                    </td>
                    <td class="py-3 px-2 text-center text-dark-100 font-semibold">
                      {{ t.scanCount }}
                    </td>
                    <td class="py-3 px-2 text-right">
                      <a
                        [href]="qrUrl(t.code)"
                        target="_blank"
                        class="text-primary-400 hover:text-primary-300 text-xs underline"
                      >
                        Télécharger QR
                      </a>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  `,
})
export class AdminTshirtsComponent implements OnInit {
  tshirts = signal<Tshirt[]>([]);
  loading = signal(true);
  newCode = signal("");
  creating = signal(false);
  createMsg = signal("");
  createSuccess = signal(false);

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.api.get("tshirts").subscribe({
      next: (res: any) => {
        this.loading.set(false);
        if (res.success) this.tshirts.set(res.data || []);
      },
      error: () => this.loading.set(false),
    });
  }

  create(): void {
    const code = this.newCode().trim().toUpperCase();
    if (!code) return;
    this.creating.set(true);
    this.createMsg.set("");
    this.api.post("tshirts", { code }).subscribe({
      next: (res: any) => {
        this.creating.set(false);
        if (res.success) {
          this.createSuccess.set(true);
          this.createMsg.set(`T-shirt ${code} créé !`);
          this.newCode.set("");
          this.load();
        } else {
          this.createSuccess.set(false);
          this.createMsg.set(res.message || "Erreur");
        }
      },
      error: () => {
        this.creating.set(false);
        this.createSuccess.set(false);
        this.createMsg.set("Erreur serveur");
      },
    });
  }

  qrUrl(code: string): string {
    const url = `${window.location.origin}/scan/${code}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(url)}`;
  }
}
