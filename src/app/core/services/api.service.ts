import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  private baseUrl = environment.apiUrl.replace(/\/$/, "");

  private url(endpoint: string): string {
    return `${this.baseUrl}/${endpoint.replace(/^\//, "")}`;
  }

  constructor(private http: HttpClient) {}

  get<T>(
    endpoint: string,
    params?: HttpParams | Record<string, any>,
  ): Observable<T> {
    return this.http.get<T>(this.url(endpoint), { params });
  }

  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(this.url(endpoint), body);
  }

  put<T>(endpoint: string, body: any): Observable<T> {
    return this.http.put<T>(this.url(endpoint), body);
  }

  patch<T>(endpoint: string, body: any): Observable<T> {
    return this.http.patch<T>(this.url(endpoint), body);
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(this.url(endpoint));
  }

  upload<T>(endpoint: string, formData: FormData): Observable<T> {
    return this.http.post<T>(this.url(endpoint), formData);
  }
}
