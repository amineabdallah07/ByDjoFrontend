import { Component, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { QrService } from "../../core/services/qr.service";

@Component({
  selector: "app-qr-scan",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="pt-24 pb-20 min-h-screen flex items-center justify-center">
      <div class="page-container">
        @if (loading()) {
          <div class="text-center py-20">
            <div class="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <p class="text-dark-400">Chargement du contenu QR...</p>
          </div>
        } @else if (error()) {
          <div class="text-center py-20">
            <div class="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-dark-100 mb-3">QR Code invalide</h2>
            <p class="text-dark-400 mb-8">{{ error() }}</p>
            <a routerLink="/" class="btn-primary">Retour à l'accueil</a>
          </div>
        } @else if (qrType() === 'LINK') {
          <div class="text-center py-20">
            <div class="w-20 h-20 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-10 h-10 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-dark-100 mb-3">Redirection...</h2>
            <p class="text-dark-400 mb-4">Redirection vers {{ content() }}</p>
          </div>
        } @else if (qrType() === 'PHOTO') {
          <div class="max-w-2xl mx-auto text-center">
            <h1 class="text-3xl font-black text-dark-100 mb-6">Contenu QR</h1>
            <div class="rounded-2xl overflow-hidden border border-dark-800 shadow-2xl">
              <img [src]="content()" alt="QR Content" class="w-full h-auto object-contain max-h-[70vh]" />
            </div>
          </div>
        }
        </div>
      </div>
    `,
})
export class QrScanPageComponent implements OnInit {
  loading = signal(true);
  error = signal("");
  qrType = signal("");
  content = signal("");

  constructor(
    private route: ActivatedRoute,
    private qrService: QrService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const code = params["code"];
      if (!code) {
        this.error.set("Code QR manquant");
        this.loading.set(false);
        return;
      }
      this.qrService.getQrContent(code).subscribe({
        next: (res) => {
          this.loading.set(false);
          if (res.success && res.data) {
            this.qrType.set(res.data.qrType);
            this.content.set(res.data.content);
            if (res.data.qrType === "LINK" && res.data.content) {
              let url = res.data.content;
              if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
              }
              setTimeout(() => { document.location.href = url; }, 500);
            }
          } else {
            this.error.set(res.message || "QR Code introuvable");
          }
        },
        error: () => {
          this.loading.set(false);
          this.error.set("Erreur lors du chargement du QR code");
        },
      });
    });
  }
}
