import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable } from "rxjs";
import { ApiResponse, Tshirt } from "../models/interfaces";

@Injectable({
  providedIn: "root",
})
export class TshirtService {
  constructor(private api: ApiService) {}

  getMyTshirts(): Observable<ApiResponse<Tshirt[]>> {
    return this.api.get("tshirts/mine");
  }

  registerScan(code: string): Observable<ApiResponse<Tshirt>> {
    return this.api.get(`tshirts/scan/${code}`);
  }
}
