import { Component, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { TshirtService } from "../../core/services/tshirt.service";
import { ApiResponse, Tshirt } from "../../core/models/interfaces";

@Component({
  selector: "app-scan",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center px-4">
      <div class="w-full max-w-md text-center">
        @if (loading()) {
          <div class="glass rounded-3xl p-8">
            <div class="w-12 h-12 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p class="text-dark-300">Vérification du T-shirt...</p>
          </div>
        } @else if (success()) {
          <div class="glass rounded-3xl p-8 animate-fade-in">
            <div class="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h1 class="text-2xl font-bold text-dark-100 mb-2">T-shirt scanné !</h1>
            <p class="text-dark-400 mb-2">Code: <span class="text-primary-400 font-bold">{{ code }}</span></p>
            <p class="text-dark-500 text-sm">Ce T-shirt a été scanné <strong class="text-dark-100">{{ scanCount }}</strong> fois.</p>
          </div>
        } @else if (error()) {
          <div class="glass rounded-3xl p-8 animate-fade-in">
            <div class="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </div>
            <h1 class="text-2xl font-bold text-dark-100 mb-2">T-shirt introuvable</h1>
            <p class="text-dark-400 mb-6">Le code scanné n'est pas valide.</p>
          </div>
        }

        <a routerLink="/" class="inline-block mt-6 text-dark-500 hover:text-primary-400 text-sm transition-colors">
          ← Retour à l'accueil
        </a>
      </div>
    </div>
  `,
})
export class ScanPageComponent implements OnInit {
  loading = signal(true);
  success = signal(false);
  error = signal(false);
  code = "";
  scanCount = 0;

  constructor(
    private route: ActivatedRoute,
    private tshirtService: TshirtService,
  ) {}

  ngOnInit(): void {
    this.code = this.route.snapshot.params["code"];
    if (!this.code) {
      this.error.set(true);
      this.loading.set(false);
      return;
    }
    this.tshirtService.registerScan(this.code).subscribe({
      next: (response: ApiResponse<Tshirt>) => {
        this.loading.set(false);
        if (response.success && response.data) {
          this.success.set(true);
          this.scanCount = response.data.scanCount;
        } else {
          this.error.set(true);
        }
      },
      error: () => {
        this.loading.set(false);
        this.error.set(true);
      },
    });
  }
}
