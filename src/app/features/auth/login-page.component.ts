import { Component, OnInit, signal, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";
import { I18nService } from "../../core/services/i18n.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center px-4 pt-20" [dir]="i18n.isRTL() ? 'rtl' : 'ltr'">
      <div class="w-full max-w-md">
        <!-- Logo -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-black tracking-[0.2em] text-dark-100 mb-2">
            BY DJO
          </h1>
          <p class="text-dark-400">{{ i18n.t().login.subtitle }}</p>
        </div>

        <div class="glass rounded-3xl p-8">
          <!-- Step 1: Enter Phone -->
          @if (step() === 1) {
            <div class="animate-fade-in">
              <h2 class="text-xl font-bold text-dark-100 mb-6 text-center">
                {{ i18n.t().login.title }}
              </h2>
              <div class="mb-4">
                <label class="block text-dark-400 text-sm mb-2"
                  >{{ i18n.t().login.phone }}</label
                >
                <div class="flex">
                  <span
                    class="inline-flex items-center px-4 bg-dark-800 border border-dark-700 border-r-0 rounded-l-lg text-dark-300 text-sm"
                  >
                    +216
                  </span>
                  <input
                    type="tel"
                    [(ngModel)]="phone"
                    class="input-dark rounded-l-none"
                    placeholder="XX XXX XXX"
                    maxlength="8"
                    (keyup.enter)="sendOtp()"
                  />
                </div>
              </div>
              <button
                (click)="sendOtp()"
                [disabled]="!phone || phone.length < 8 || sending()"
                class="btn-gold w-full mt-4"
              >
                @if (sending()) {
                  <div
                    class="w-5 h-5 border-2 border-dark-950 border-t-transparent rounded-full animate-spin mx-auto"
                  ></div>
                } @else {
                  {{ i18n.t().login.sendOtp }}
                }
              </button>
            </div>
          }

          <!-- Step 2: Verify OTP -->
          @if (step() === 2) {
            <div class="animate-fade-in">
              <h2 class="text-xl font-bold text-dark-100 mb-2 text-center">
                {{ i18n.t().login.verification }}
              </h2>
              <p class="text-dark-400 text-sm text-center mb-6">
                {{ i18n.t().login.otpSentTo }}
                <span class="text-primary-400">+216 {{ phone }}</span>
              </p>

              <div class="flex gap-3 justify-center mb-6">
                @for (i of [0, 1, 2, 3, 4, 5]; track i) {
                  <input
                    type="text"
                    maxlength="1"
                    [id]="'otp-' + i"
                    class="w-12 h-14 text-center text-xl font-bold bg-dark-800 border border-dark-700 rounded-xl
                                text-dark-100 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all"
                    (input)="onOtpInput($event, i)"
                    (keydown.backspace)="onOtpBackspace($event, i)"
                  />
                }
              </div>

              <button
                (click)="verifyOtp()"
                [disabled]="otpCode().length < 6 || verifying()"
                class="btn-gold w-full"
              >
                @if (verifying()) {
                  <div
                    class="w-5 h-5 border-2 border-dark-950 border-t-transparent rounded-full animate-spin mx-auto"
                  ></div>
                } @else {
                  {{ i18n.t().login.verify }}
                }
              </button>

              <div class="text-center mt-4">
                <button
                  (click)="resendOtp()"
                  [disabled]="resendCooldown() > 0"
                  class="text-dark-400 hover:text-primary-400 text-sm transition-colors disabled:opacity-50"
                >
                  @if (resendCooldown() > 0) {
                    {{ i18n.t().login.resend }} ({{ resendCooldown() }}s)
                  } @else {
                    {{ i18n.t().login.resend }}
                  }
                </button>
              </div>

              <button
                (click)="step.set(1)"
                class="block mx-auto mt-4 text-dark-500 hover:text-dark-100 text-sm transition-colors"
              >
                ← {{ i18n.t().login.phone }}
              </button>
            </div>
          }

          <!-- Error Message -->
          @if (errorMessage()) {
            <div
              class="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center"
            >
              {{ errorMessage() }}
            </div>
          }
        </div>

        <p class="text-center text-dark-500 text-sm mt-6">
          BY DJO &copy; 2024
        </p>
      </div>
    </div>
  `,
})
export class LoginPageComponent implements OnInit {
  i18n = inject(I18nService);

  phone = "";
  step = signal(1);
  otpCode = signal("");
  sending = signal(false);
  verifying = signal(false);
  resendCooldown = signal(0);
  errorMessage = signal("");
  private cooldownInterval: any;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (this.authService.currentUser$) {
      this.authService.currentUser$.subscribe((user) => {
        if (user) {
          this.router.navigate(["/account"]);
        }
      });
    }
  }

  sendOtp(): void {
    if (!this.phone || this.phone.length < 8) return;
    this.sending.set(true);
    this.errorMessage.set("");
    const formattedPhone = "+216" + this.phone.replace(/\s/g, "");
    this.authService.sendOtp(formattedPhone).subscribe({
      next: () => {
        this.sending.set(false);
        this.step.set(2);
        this.startResendCooldown();
      },
      error: (err) => {
        this.sending.set(false);
        this.errorMessage.set(err?.error?.message || this.i18n.t().common.error);
      },
    });
  }

  verifyOtp(): void {
    if (this.otpCode().length < 6) return;
    this.verifying.set(true);
    this.errorMessage.set("");
    const formattedPhone = "+216" + this.phone.replace(/\s/g, "");
    this.authService.verifyOtp(formattedPhone, this.otpCode()).subscribe({
      next: (response: any) => {
        this.verifying.set(false);
        if (response.success) {
          const returnUrl = new URLSearchParams(window.location.search).get("returnUrl") || "";
          if (returnUrl && returnUrl !== "/account") {
            this.router.navigate(["/account"], { queryParams: { next: returnUrl } });
          } else {
            this.router.navigate(["/account"]);
          }
        } else {
          this.errorMessage.set(response.message || this.i18n.t().common.error);
        }
      },
      error: (err) => {
        this.verifying.set(false);
        this.errorMessage.set(err?.error?.message || this.i18n.t().common.error);
      },
    });
  }

  resendOtp(): void {
    if (this.resendCooldown() > 0) return;
    this.otpCode.set("");
    this.step.set(1);
    this.sendOtp();
  }

  onOtpInput(event: any, index: number): void {
    const value = event.target.value;
    if (value) {
      const current = this.otpCode().split("");
      current[index] = value;
      this.otpCode.set(current.join(""));
      if (index < 5) {
        document.getElementById("otp-" + (index + 1))?.focus();
      }
      if (this.otpCode().length === 6) {
        this.verifyOtp();
      }
    }
  }

  onOtpBackspace(event: any, index: number): void {
    if (index > 0 && !event.target.value) {
      document.getElementById("otp-" + (index - 1))?.focus();
      const current = this.otpCode().split("");
      current.splice(index - 1, 1);
      this.otpCode.set(current.join(""));
    }
  }

  startResendCooldown(): void {
    this.resendCooldown.set(60);
    this.cooldownInterval = setInterval(() => {
      const current = this.resendCooldown();
      if (current <= 1) {
        clearInterval(this.cooldownInterval);
        this.resendCooldown.set(0);
      } else {
        this.resendCooldown.set(current - 1);
      }
    }, 1000);
  }
}
