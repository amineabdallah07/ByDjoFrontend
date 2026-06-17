import { Component, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { TshirtService } from "../../core/services/tshirt.service";
import { Tshirt } from "../../core/models/interfaces";

@Component({
  selector: "app-tshirts",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="pt-24 pb-20">
      <div class="page-container max-w-2xl">
        <h1 class="text-4xl font-black text-dark-100 mb-8">MES T-SHIRTS</h1>

        <div class="glass rounded-2xl p-8">
          @if (loading()) {
            <div class="flex justify-center py-8">
              <div class="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          } @else if (tshirts().length === 0) {
            <div class="text-center py-8">
              <svg class="w-16 h-16 text-dark-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z"/>
              </svg>
              <p class="text-dark-400">Vous n'avez pas encore de T-shirts.</p>
            </div>
          } @else {
            <div class="space-y-4">
              @for (tshirt of tshirts(); track tshirt.id) {
                <div class="bg-dark-800/50 rounded-xl p-5 border border-dark-700">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-dark-100 font-bold text-lg">{{ tshirt.code }}</p>
                      <p class="text-dark-500 text-sm mt-1">
                        Créé le {{ tshirt.createdAt | date:'dd/MM/yyyy' }}
                      </p>
                    </div>
                    <div class="text-right">
                      <p class="text-3xl font-black text-primary-400">{{ tshirt.scanCount }}</p>
                      <p class="text-dark-500 text-sm">
                        scan{{ tshirt.scanCount !== 1 ? 's' : '' }}
                      </p>
                    </div>
                  </div>
                </div>
              }
            </div>
          }

          <a routerLink="/account" class="block mt-6 text-dark-500 hover:text-primary-400 text-sm transition-colors">
            ← Retour au compte
          </a>
        </div>
      </div>
    </div>
  `,
})
export class TshirtsPageComponent implements OnInit {
  tshirts = signal<Tshirt[]>([]);
  loading = signal(true);

  constructor(private tshirtService: TshirtService) {}

  ngOnInit(): void {
    this.tshirtService.getMyTshirts().subscribe({
      next: (response: any) => {
        this.loading.set(false);
        if (response.success && response.data) {
          this.tshirts.set(response.data);
        }
      },
      error: () => this.loading.set(false),
    });
  }
}
