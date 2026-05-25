import { Component, OnInit, inject, signal, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CartService } from "../../core/services/cart.service";
import { I18nService } from "../../core/services/i18n.service";
import { OrderService } from "../../core/services/order.service";
import { AuthService } from "../../core/services/auth.service";
import { CloudinaryService } from "../../core/services/cloudinary.service";

@Component({
  selector: "app-checkout",
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="pt-24 pb-20">
      <div class="page-container">
        <h1 class="text-4xl font-black text-dark-100 mb-8">PASSER LA COMMANDE</h1>

        @if (cartData() && cartData()!.items.length > 0 && !orderSuccess()) {
          <div class="grid lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 space-y-6">
              <!-- Formulaire livraison -->
              <div class="glass rounded-2xl p-6">
                <h2 class="text-xl font-bold text-dark-100 mb-6">
                  Informations de livraison
                </h2>

                @if (validationError()) {
                  <div
                    class="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-red-400 text-sm animate-fade-in"
                  >
                    <svg
                      class="w-4 h-4 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                      />
                    </svg>
                    {{ validationError() }}
                  </div>
                }

                <div class="grid md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-dark-400 text-sm mb-2"
                      >Nom complet *</label
                    >
                    <!-- Nom complet: pré-rempli depuis le profil (lecture seule si connecté avec nom) -->
                    @if (isLoggedIn() && fullNameFromProfile()) {
                      <div class="relative">
                        <input
                          type="text"
                          [value]="ord.fullName"
                          readonly
                          class="input-dark opacity-60 cursor-not-allowed pr-10"
                        />
                        <span
                          class="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500"
                          title="Nom de votre compte"
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
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </span>
                      </div>
                      <p class="text-dark-600 text-xs mt-1">
                        Nom lié à votre compte
                      </p>
                    } @else {
                      <input
                        type="text"
                        [(ngModel)]="ord.fullName"
                        class="input-dark"
                        [class.border-red-500]="fieldError('fullName')"
                        placeholder="Votre nom complet"
                      />
                    }
                  </div>

                  <div>
                    <label class="block text-dark-400 text-sm mb-2"
                      >Téléphone</label
                    >
                    <div class="relative">
                      @if (isLoggedIn()) {
                        <input
                          type="tel"
                          [value]="ord.phone"
                          readonly
                          class="input-dark opacity-60 cursor-not-allowed pr-10"
                        />
                        <span
                          class="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500"
                          title="Numéro lié à votre compte"
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
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                        </span>
                      } @else {
                        <input
                          type="tel"
                          [(ngModel)]="ord.phone"
                          maxlength="8"
                          placeholder="XX XXX XXX"
                          [class.border-red-500]="fieldError('phone')"
                          class="input-dark"
                        />
                      }
                    </div>
                    <p class="text-dark-600 text-xs mt-1">
                      Numéro lié à votre compte
                    </p>
                  </div>

                  <div>
                    <label class="block text-dark-400 text-sm mb-2"
                      >{{ i18n.t().checkout.state }} *</label
                    >
                    <select
                      [(ngModel)]="ord.governorate"
                      class="input-dark"
                      [class.border-red-500]="fieldError('governorate')"
                    >
                      <option value="">Sélectionner</option>
                      @for (g of govs; track g) {
                        <option [value]="g">{{ g }}</option>
                      }
                    </select>
                  </div>

                  <div>
                    <label class="block text-dark-400 text-sm mb-2"
                      >{{ i18n.t().checkout.city }} *</label
                    >
                    <input
                      type="text"
                      [(ngModel)]="ord.city"
                      class="input-dark"
                      [class.border-red-500]="fieldError('city')"
                      placeholder="Votre ville"
                    />
                  </div>

                  <div class="md:col-span-2">
                    <label class="block text-dark-400 text-sm mb-2"
                      >{{ i18n.t().checkout.address }} *</label
                    >
                    <input
                      type="text"
                      [(ngModel)]="ord.address"
                      class="input-dark"
                      [class.border-red-500]="fieldError('address')"
                      placeholder="Rue, numéro..."
                    />
                  </div>

                  <div class="md:col-span-2">
                    <label class="block text-dark-400 text-sm mb-2"
                      >Notes</label
                    >
                    <textarea
                      [(ngModel)]="ord.notes"
                      class="input-dark"
                      rows="2"
                      placeholder="Instructions..."
                    ></textarea>
                  </div>
                </div>
              </div>

              <!-- Paiement -->
              <div class="glass rounded-2xl p-6">
                <h2 class="text-xl font-bold text-dark-100 mb-4">
                  Mode de paiement
                </h2>
                <div
                  class="flex items-center gap-4 p-4 border-2 border-primary-500 rounded-xl bg-primary-500/5"
                >
                  <div
                    class="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center"
                  >
                    <svg
                      class="w-5 h-5 text-dark-950"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p class="text-dark-100 font-semibold">
                      {{ i18n.t().checkout.cashOnDelivery }}
                    </p>
                    <p class="text-dark-400 text-sm">
                      Payez en espèces à la réception
                    </p>
                  </div>
                </div>
              </div>

              <!-- Code promo -->
              <div class="glass rounded-2xl p-6">
                <h2 class="text-xl font-bold text-dark-100 mb-4">Code promo</h2>
                <div class="flex gap-3">
                  <input
                    type="text"
                    [(ngModel)]="couponCode"
                    [disabled]="couponApplied() || applyingCoupon()"
                    class="input-dark flex-1"
                    placeholder="Entrez votre code promo"
                  />
                  <button
                    (click)="applyCoupon()"
                    [disabled]="
                      !couponCode.trim() || couponApplied() || applyingCoupon()
                    "
                    class="btn-secondary px-5 shrink-0 disabled:opacity-40"
                  >
                    @if (applyingCoupon()) {
                      <div
                        class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
                      ></div>
                    } @else if (couponApplied()) {
                      ✓ Appliqué
                    } @else {
                      Appliquer
                    }
                  </button>
                </div>
                @if (couponError()) {
                  <p class="text-red-400 text-sm mt-2">{{ couponError() }}</p>
                }
                @if (couponApplied()) {
                  <p class="text-green-400 text-sm mt-2">
                    ✓ Code "{{ cartData()?.couponCode }}" appliqué
                  </p>
                }
              </div>
            </div>

            <!-- Récapitulatif -->
            <div>
              <div class="glass rounded-2xl p-6 sticky top-24 space-y-4">
                <h3 class="text-dark-100 font-bold text-lg">{{ i18n.t().checkout.orderSummary }}</h3>
                <div class="space-y-3 max-h-64 overflow-y-auto">
                  @for (item of cartData()!.items; track item.id) {
                    <div class="flex gap-3">
                      <div
                        class="w-12 h-12 bg-dark-800 rounded-lg shrink-0 overflow-hidden"
                      >
                        @if (item.productImage) {
                          <img
                            [src]="getImageUrl(item.productImage)"
                            [alt]="item.productName"
                            class="w-full h-full object-cover"
                          />
                        }
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-dark-100 text-sm line-clamp-1">
                          {{ item.productName }}
                        </p>
                        <p class="text-dark-500 text-xs">
                          x {{ item.quantity }}
                        </p>
                      </div>
                      <span class="text-dark-300 text-sm">{{
                        fmt(item.totalPrice)
                      }}</span>
                    </div>
                  }
                </div>
                <hr class="border-dark-700" />
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-dark-400">Sous-total</span>
                    <span class="text-dark-100">{{
                      fmt(cartData()!.subtotal)
                    }}</span>
                  </div>
                  @if (cartData()!.discount > 0) {
                    <div class="flex justify-between">
                      <span class="text-green-400">Réduction</span>
                      <span class="text-green-400"
                        >-{{ fmt(cartData()!.discount) }}</span
                      >
                    </div>
                  }
                  <div class="flex justify-between">
                    <span class="text-dark-400">Livraison</span>
                    <span
                      [class]="
                        cartData()!.shippingCost === 0
                          ? 'text-green-400'
                          : 'text-dark-100'
                      "
                    >
                      {{
                        cartData()!.shippingCost === 0
                          ? "Gratuite"
                          : fmt(cartData()!.shippingCost)
                      }}
                    </span>
                  </div>
                  <hr class="border-dark-700" />
                  <div class="flex justify-between text-lg font-bold">
                    <span class="text-dark-100">Total</span>
                    <span class="text-primary-400">{{
                      fmt(cartData()!.total)
                    }}</span>
                  </div>
                </div>

                <!-- BOUTON COMMANDER: redirige vers login si non connecté -->
                <button
                  (click)="placeOrder()"
                  [disabled]="submitting()"
                  class="btn-gold w-full text-center"
                >
                  @if (submitting()) {
                    <div
                      class="w-5 h-5 border-2 border-dark-950 border-t-transparent rounded-full animate-spin mx-auto"
                    ></div>
                  } @else {
                    Confirmer la commande
                  }
                </button>

                <!-- Indication connexion si non connecté -->
                @if (!isLoggedIn()) {
                  <p class="text-dark-500 text-xs text-center">
                    <svg
                      class="w-3 h-3 inline mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    Connexion requise pour commander
                  </p>
                }
              </div>
            </div>
          </div>
        }

        @if (
          !cartData() || (cartData()!.items.length === 0 && !orderSuccess())
        ) {
          <div class="text-center py-20">
            <p class="text-dark-400 mb-4">Votre panier est vide</p>
            <a routerLink="/shop" class="btn-primary">Explorer la boutique</a>
          </div>
        }

        @if (orderSuccess()) {
          <div class="text-center py-20 animate-fade-up">
            <div
              class="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <svg
                class="w-12 h-12 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 class="text-3xl font-bold text-dark-100 mb-3">
              Commande Confirmée!
            </h2>
            <p class="text-dark-400 text-lg mb-2">Merci pour votre commande</p>
            <p class="text-primary-400 font-bold text-xl mb-8">
              Commande #{{ orderNumber() }}
            </p>
            <a routerLink="/shop" class="btn-gold">Continuer les achats</a>
          </div>
        }
      </div>
    </div>
  `,
})
export class CheckoutPageComponent implements OnInit {
  i18n = inject(I18nService);
  private cs = inject(CartService);
  private cloudinary = inject(CloudinaryService);
  private orderSvc = inject(OrderService);
  private authService = inject(AuthService);
  private router = inject(Router);

  cartData = computed(() => this.cs.cart());
  isLoggedIn = this.authService.isLoggedIn;

  // Indique si le nom complet vient du profil (pour le rendre readonly)
  fullNameFromProfile = signal(false);

  submitting = signal(false);
  orderSuccess = signal(false);
  orderNumber = signal("");

  validationError = signal("");
  touchedFields = signal<string[]>([]);

  couponCode = "";
  applyingCoupon = signal(false);
  couponApplied = signal(false);
  couponError = signal("");

  ord = {
    fullName: "",
    phone: "",
    governorate: "",
    city: "",
    address: "",
    notes: "",
  };

  govs = [
    "Tunis",
    "Ariana",
    "Ben Arous",
    "Manouba",
    "Nabeul",
    "Zaghouan",
    "Bizerte",
    "Beja",
    "Jendouba",
    "Kef",
    "Siliana",
    "Sousse",
    "Monastir",
    "Mahdia",
    "Sfax",
    "Kairouan",
    "Kasserine",
    "Sidi Bouzid",
    "Gabes",
    "Medenine",
    "Tataouine",
    "Gafsa",
    "Tozeur",
    "Kebili",
  ];

  ngOnInit(): void {
    // Pré-remplir depuis le compte connecté
    this.authService.currentUser$.subscribe((user) => {
      if (user?.phone) {
        this.ord.phone = user.phone;
      }
      // Auto-remplir le nom complet depuis prénom + nom du profil
      if (user?.firstName && user?.lastName) {
        this.ord.fullName = `${user.firstName} ${user.lastName}`.trim();
        this.fullNameFromProfile.set(true);
      } else if (user?.firstName) {
        this.ord.fullName = user.firstName.trim();
        this.fullNameFromProfile.set(true);
      } else {
        this.fullNameFromProfile.set(false);
      }
    });
  }

  fieldError(field: string): boolean {
    return this.touchedFields().includes(field) && !(this.ord as any)[field];
  }

  applyCoupon(): void {
    if (!this.couponCode.trim()) return;
    this.applyingCoupon.set(true);
    this.couponError.set("");
    this.cs.applyCoupon(this.couponCode.trim()).subscribe({
      next: () => {
        this.applyingCoupon.set(false);
        this.couponApplied.set(true);
      },
      error: (err) => {
        this.applyingCoupon.set(false);
        this.couponError.set(
          err?.error?.message || "Code promo invalide ou expiré.",
        );
      },
    });
  }

  placeOrder(): void {
    // ─── Vérifier la connexion ───────────────────────────────────────────────
    // Si l'utilisateur n'est PAS connecté → rediriger vers login avec returnUrl=/checkout
    if (!this.isLoggedIn()) {
      this.router.navigate(["/auth/login"], {
        queryParams: { returnUrl: "/checkout" },
      });
      return;
    }

    // ─── Validation des champs ───────────────────────────────────────────────
    const required = ["fullName", "governorate", "city", "address"] as const;
    const missing = required.filter((f) => !(this.ord as any)[f]);
    this.touchedFields.set(required.filter((f) => !(this.ord as any)[f]));

    if (missing.length > 0) {
      this.validationError.set(
        "Veuillez remplir tous les champs obligatoires (*).",
      );
      document
        .querySelector(".border-red-500")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    this.validationError.set("");
    this.submitting.set(true);

    this.orderSvc
      .createOrder({
        shippingFullName: this.ord.fullName,
        shippingPhone: this.ord.phone,
        shippingGovernorate: this.ord.governorate,
        shippingCity: this.ord.city,
        shippingAddress: this.ord.address,
        shippingNotes: this.ord.notes,
        couponCode: this.cartData()?.couponCode || undefined,
        sessionCartId: localStorage.getItem("cart_session_id") || undefined,
      })
      .subscribe({
        next: (r) => {
          this.submitting.set(false);
          this.orderSuccess.set(true);
          this.orderNumber.set(r.orderNumber);
          this.cs.loadCart();
        },
        error: () => {
          this.submitting.set(false);
          this.validationError.set(
            "Une erreur est survenue. Veuillez réessayer.",
          );
        },
      });
  }

  getImageUrl(url: string): string {
    return this.cloudinary.getThumbnailUrl(url);
  }

  fmt(n: number): string {
    return this.cs.formatPrice(n);
  }
}
