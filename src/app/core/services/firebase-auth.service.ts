import { Injectable, NgZone, signal } from "@angular/core";
import { initializeApp, FirebaseApp } from "firebase/app";
import {
  getAuth,
  Auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class FirebaseAuthService {
  private app: FirebaseApp;
  private auth: Auth;
  private confirmationResult: ConfirmationResult | null = null;
  public recaptchaReady = signal(false);

  constructor(private ngZone: NgZone) {
    this.app = initializeApp(environment.firebase);
    this.auth = getAuth(this.app);
  }

  initRecaptcha(containerId: string): void {
    if (!this.auth) return;
    const verifier = new RecaptchaVerifier(this.auth, containerId, {
      size: "invisible",
      callback: () => {
        this.ngZone.run(() => this.recaptchaReady.set(true));
      },
    });
    verifier.render().then(() => {
      this.ngZone.run(() => this.recaptchaReady.set(true));
    });
    (window as any).recaptchaVerifier = verifier;
  }

  async sendOtp(phone: string): Promise<void> {
    const verifier = (window as any).recaptchaVerifier as RecaptchaVerifier;
    if (!verifier) throw new Error("Recaptcha not initialized");
    const result = await signInWithPhoneNumber(this.auth, phone, verifier);
    this.confirmationResult = result;
  }

  async verifyOtp(code: string): Promise<string> {
    if (!this.confirmationResult) throw new Error("No OTP sent");
    const result = await this.confirmationResult.confirm(code);
    const idToken = await result.user.getIdToken();
    return idToken;
  }

  reset(): void {
    this.confirmationResult = null;
  }
}
