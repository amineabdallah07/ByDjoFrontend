import { Injectable, signal, computed } from "@angular/core";
import { ApiService } from "./api.service";
import {
  User,
  AuthResponse,
  OtpRequest,
  OtpVerify,
} from "../models/interfaces";
import { Observable, tap } from "rxjs";
import { toObservable } from "@angular/core/rxjs-interop";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  // ─── Signal natif comme source de vérité ────────────────────────────────────
  // computed() d'Angular ne réagit QU'aux signals — pas aux BehaviorSubject.
  // En utilisant un signal, isLoggedIn() et isAdmin() sont réellement réactifs
  // sans avoir besoin d'actualiser la page.
  private currentUserSignal = signal<User | null>(null);

  // Observable dérivé du signal pour compatibilité avec le code existant (async pipe, subscribe)
  public currentUser$ = toObservable(this.currentUserSignal);

  // computed() réactifs — se mettent à jour instantanément quand currentUserSignal change
  public isLoggedIn = computed(() => !!this.currentUserSignal());
  public isAdmin = computed(
    () => this.currentUserSignal()?.roles?.includes("ADMIN") ?? false,
  );

  constructor(private api: ApiService) {
    this.loadUser();
  }

  private loadUser(): void {
    const token = localStorage.getItem("access_token");
    const userStr = localStorage.getItem("user");
    if (token && userStr) {
      try {
        this.currentUserSignal.set(JSON.parse(userStr));
      } catch {
        this.logout();
      }
    }
  }

  sendOtp(phone: string): Observable<any> {
    const request: OtpRequest = { phone };
    return this.api.post("auth/otp/send", request);
  }

  verifyOtp(phone: string, code: string): Observable<any> {
    const request: OtpVerify = { phone, code };
    return this.api.post("auth/otp/verify", request).pipe(
      tap((response: any) => {
        if (response.success && response.data) {
          this.handleAuth(response.data);
        }
      }),
    );
  }

  refreshToken(refreshToken: string): Observable<any> {
    return this.api.post("auth/refresh", { refreshToken }).pipe(
      tap((response: any) => {
        if (response.success && response.data) {
          this.handleAuth(response.data);
        }
      }),
    );
  }

  getCurrentUser(): Observable<any> {
    return this.api.get("auth/me").pipe(
      tap((response: any) => {
        if (response.success && response.data) {
          this.currentUserSignal.set(response.data);
          localStorage.setItem("user", JSON.stringify(response.data));
        }
      }),
    );
  }

  updateProfile(data: any): Observable<any> {
    return this.api.put("auth/profile", data).pipe(
      tap((response: any) => {
        if (response.success && response.data) {
          this.currentUserSignal.set(response.data);
          localStorage.setItem("user", JSON.stringify(response.data));
        }
      }),
    );
  }

  logout(): void {
    const token = this.getToken();
    if (token) {
      this.api.post("auth/logout", {}).subscribe({ error: () => {} });
    }
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    // Le signal se met à null → isLoggedIn() devient false instantanément
    // → la navbar bascule sur "Connexion" sans refresh
    this.currentUserSignal.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem("access_token");
  }

  private handleAuth(data: AuthResponse): void {
    localStorage.setItem("access_token", data.accessToken);
    localStorage.setItem("refresh_token", data.refreshToken);
    localStorage.setItem("user", JSON.stringify(data.user));
    // Le signal se met à jour → isLoggedIn() devient true instantanément
    // → la navbar bascule sur l'icône user sans refresh
    this.currentUserSignal.set(data.user);
  }
}
