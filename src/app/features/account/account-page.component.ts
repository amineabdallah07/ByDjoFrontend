import { Component, OnInit, signal, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink, ActivatedRoute } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";
import { I18nService } from "../../core/services/i18n.service";
import { User } from "../../core/models/interfaces";

@Component({
  selector: "app-account",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="pt-24 pb-20">
      <div class="page-container max-w-2xl">
        <h1 class="text-4xl font-black text-dark-100 mb-8">MON COMPTE</h1>

        @if (authService.currentUser$ | async; as user) {
          <!-- ========== BANNER: Profil incomplet ========== -->
          @if (profileIncomplete(user)) {
            <div
              class="mb-6 p-4 bg-primary-500/10 border border-primary-500/40 rounded-2xl flex items-start gap-3 animate-fade-in"
            >
              <svg
                class="w-5 h-5 text-primary-400 mt-0.5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z"
                />
              </svg>
              <div>
                <p class="text-primary-300 font-semibold text-sm">
                  Complétez votre profil
                </p>
                <p class="text-dark-400 text-sm mt-0.5">
                  Veuillez saisir votre nom et prénom pour continuer vos achats.
                </p>
              </div>
            </div>
          }

          <div class="glass rounded-2xl p-8 space-y-6">
            <div class="flex items-center justify-between gap-6">
              <div class="flex items-center gap-6">
                <div
                  class="w-20 h-20 bg-primary-500/10 rounded-full flex items-center justify-center shrink-0"
                >
                  <span class="text-2xl font-bold text-primary-400"
                    >{{ (user.firstName || "?")[0]
                    }}{{ (user.lastName || "?")[0] }}</span
                  >
                </div>
                <div>
                  @if (profileIncomplete(user)) {
                    <h2 class="text-xl font-bold text-dark-400 italic">
                      Profil incomplet
                    </h2>
                  } @else {
                    <h2 class="text-xl font-bold text-dark-100">
                      {{ user.firstName }} {{ user.lastName }}
                    </h2>
                  }
                  <p class="text-dark-400">{{ user.phone }}</p>
                </div>
              </div>
              <!-- Bouton modifier — masqué si profil incomplet (le form s'affiche auto) -->
              @if (!editMode() && !profileIncomplete(user)) {
                <button
                  (click)="startEdit(user)"
                  class="btn-secondary flex items-center gap-2 shrink-0"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Modifier
                </button>
              }
            </div>

            <!-- ========== FORMULAIRE Profil (obligatoire si incomplet, sinon optionnel) ========== -->
            @if (editMode() || profileIncomplete(user)) {
              <div
                class="bg-dark-800/50 rounded-2xl p-5 border animate-fade-in space-y-4"
                [class.border-primary-500]="profileIncomplete(user)"
                [class.border-dark-700]="!profileIncomplete(user)"
              >
                <h3 class="text-dark-100 font-semibold flex items-center gap-2">
                  @if (profileIncomplete(user)) {
                    <span
                      class="w-2 h-2 rounded-full bg-primary-400 inline-block"
                    ></span>
                    Créer mon profil
                    <span class="text-primary-400 text-sm font-normal"
                      >(obligatoire)</span
                    >
                  } @else {
                    Modifier mes informations
                  }
                </h3>

                @if (updateError()) {
                  <div
                    class="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm"
                  >
                    {{ updateError() }}
                  </div>
                }
                @if (updateSuccess()) {
                  <div
                    class="p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm"
                  >
                    ✓ Profil enregistré avec succès !
                  </div>
                }

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-dark-400 text-sm mb-1.5">
                      Prénom <span class="text-primary-400">*</span>
                    </label>
                    <input
                      type="text"
                      [(ngModel)]="editForm.firstName"
                      class="input-dark w-full"
                      [class.border-red-500]="
                        showFieldErrors() && !editForm.firstName.trim()
                      "
                      placeholder="Prénom"
                      autofocus
                    />
                    @if (showFieldErrors() && !editForm.firstName.trim()) {
                      <p class="text-red-400 text-xs mt-1">
                        Le prénom est obligatoire
                      </p>
                    }
                  </div>
                  <div>
                    <label class="block text-dark-400 text-sm mb-1.5">
                      Nom <span class="text-primary-400">*</span>
                    </label>
                    <input
                      type="text"
                      [(ngModel)]="editForm.lastName"
                      class="input-dark w-full"
                      [class.border-red-500]="
                        showFieldErrors() && !editForm.lastName.trim()
                      "
                      placeholder="Nom"
                    />
                    @if (showFieldErrors() && !editForm.lastName.trim()) {
                      <p class="text-red-400 text-xs mt-1">
                        Le nom est obligatoire
                      </p>
                    }
                  </div>
                </div>

                <div class="flex gap-3 pt-1">
                  @if (!profileIncomplete(user)) {
                    <button
                      (click)="cancelEdit()"
                      class="flex-1 px-4 py-2.5 rounded-xl bg-dark-700 text-dark-300 hover:bg-dark-600 transition-colors text-sm font-medium"
                    >
                      Annuler
                    </button>
                  }
                  <button
                    (click)="saveProfile()"
                    [disabled]="saving()"
                    class="flex-1 btn-primary text-sm flex items-center justify-center gap-2"
                  >
                    @if (saving()) {
                      <div
                        class="w-4 h-4 border-2 border-dark-950 border-t-transparent rounded-full animate-spin"
                      ></div>
                    } @else {
                      @if (profileIncomplete(user)) {
                        Enregistrer et continuer
                      } @else {
                        Enregistrer
                      }
                    }
                  </button>
                </div>
              </div>
            }

            <!-- Liens compte — masqués si profil incomplet -->
            @if (!profileIncomplete(user)) {
              <hr class="border-dark-700" />

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                  routerLink="/account/orders"
                  class="glass rounded-xl p-4 hover:border-primary-500/30 transition-all group"
                >
                  <svg
                    class="w-8 h-8 text-primary-500 mb-2 group-hover:scale-110 transition-transform"
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
                  <h3 class="text-dark-100 font-semibold">Mes Commandes</h3>
                  <p class="text-dark-500 text-sm">Suivre vos commandes</p>
                </a>

                <a
                  routerLink="/account/wishlist"
                  class="glass rounded-xl p-4 hover:border-primary-500/30 transition-all group"
                >
                  <svg
                    class="w-8 h-8 text-primary-500 mb-2 group-hover:scale-110 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <h3 class="text-dark-100 font-semibold">Ma Wishlist</h3>
                  <p class="text-dark-500 text-sm">Produits favoris</p>
                </a>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class AccountPageComponent implements OnInit {
  i18n = inject(I18nService);
  editMode = signal(false);
  saving = signal(false);
  updateError = signal("");
  updateSuccess = signal(false);
  showFieldErrors = signal(false);

  editForm = { firstName: "", lastName: "", phone: "" };

  // URL vers laquelle rediriger après avoir sauvegardé le profil (ex: /checkout)
  private nextUrl = "";

  constructor(
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    // Récupérer le paramètre "next" pour la redirection post-enregistrement
    this.route.queryParams.subscribe((params) => {
      this.nextUrl = params["next"] || "";
    });

    // Pré-remplir le formulaire avec les données actuelles
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.editForm = {
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          phone: user.phone || "",
        };
        // Si profil incomplet, ouvrir le formulaire automatiquement
        if (this.profileIncomplete(user)) {
          this.editMode.set(true);
        }
      }
    });
  }

  profileIncomplete(user: User): boolean {
    return !user.firstName?.trim() || !user.lastName?.trim();
  }

  startEdit(user: User): void {
    this.editForm = {
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
    };
    this.updateError.set("");
    this.updateSuccess.set(false);
    this.showFieldErrors.set(false);
    this.editMode.set(true);
  }

  cancelEdit(): void {
    this.editMode.set(false);
    this.updateError.set("");
    this.showFieldErrors.set(false);
  }

  saveProfile(): void {
    this.showFieldErrors.set(true);

    if (!this.editForm.firstName.trim() || !this.editForm.lastName.trim()) {
      this.updateError.set("Le prénom et le nom sont obligatoires.");
      return;
    }

    this.saving.set(true);
    this.updateError.set("");

    this.authService.updateProfile(this.editForm).subscribe({
      next: () => {
        this.saving.set(false);
        this.updateSuccess.set(true);
        this.showFieldErrors.set(false);

        setTimeout(() => {
          this.editMode.set(false);
          this.updateSuccess.set(false);

          // Rediriger vers la page cible si elle existe (ex: /checkout)
          if (this.nextUrl) {
            this.router.navigate([this.nextUrl]);
          }
        }, 1200);
      },
      error: (err) => {
        this.saving.set(false);
        this.updateError.set(
          err?.error?.message || "Erreur lors de la mise à jour.",
        );
      },
    });
  }
}
