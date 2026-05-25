import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  // Routes publiques qui ne doivent PAS recevoir le token
  private readonly PUBLIC_ROUTES = [
    "auth/otp/send",
    "auth/otp/verify",
    "auth/refresh",
  ];

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem("access_token");

    const isExternal =
      req.url.startsWith("https://api.cloudinary.com") ||
      req.url.startsWith("https://res.cloudinary.com");

    const isPublicAuthRoute = this.PUBLIC_ROUTES.some((route) =>
      req.url.includes(route),
    );

    if (token && !isPublicAuthRoute && !isExternal) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      return next.handle(cloned);
    }

    return next.handle(req);
  }
}
