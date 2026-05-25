import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, from, forkJoin } from "rxjs";
import { map, switchMap } from "rxjs/operators";

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  width: number;
  height: number;
  format: string;
}

@Injectable({ providedIn: "root" })
export class CloudinaryService {
  // ⚠️ Remplacez ces valeurs par vos propres credentials Cloudinary
  private cloudName = "dqwpbgfoh"; // ex: 'dxyz123abc'
  private uploadPreset = "bydjo_products"; // ex: 'bydjo_products' (unsigned preset)

  private uploadUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;

  constructor(private http: HttpClient) {}

  /**
   * Upload un seul fichier vers Cloudinary (unsigned upload)
   */
  uploadFile(
    file: File,
    folder = "bydjo/products",
  ): Observable<CloudinaryUploadResult> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", this.uploadPreset);
    formData.append("folder", folder);

    return this.http.post<CloudinaryUploadResult>(this.uploadUrl, formData);
  }

  /**
   * Upload plusieurs fichiers et retourne tous les résultats
   */
  uploadFiles(
    files: File[],
    folder = "bydjo/products",
  ): Observable<CloudinaryUploadResult[]> {
    const uploads = files.map((file) => this.uploadFile(file, folder));
    return forkJoin(uploads);
  }

  /**
   * Génère une URL optimisée Cloudinary avec transformations
   */
  // Dans cloudinary.service.ts — remplace getOptimizedUrl par :
  getOptimizedUrl(url: string, width?: number, height?: number): string {
    if (!url) return "";

    // URL locale retournée par le backend (ex: /uploads/products/xxx.jpg)
    // ou juste un nom de fichier → construire l'URL complète sans doubler /uploads/
    if (!url.startsWith("http")) {
      const path = url.startsWith("/uploads/") ? url : `/uploads/${url}`;
      return `http://localhost:8080/api${path}`;
    }

    // URL déjà complète mais pas Cloudinary → retourner telle quelle
    if (!url.includes("cloudinary.com")) return url;

    // URL Cloudinary → optimiser
    const transformations = [];
    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    transformations.push("c_fill", "q_auto", "f_auto");

    return url.replace("/upload/", `/upload/${transformations.join(",")}/`);
  }

  /**
   * Image haute résolution pour la page produit
   */
  getProductUrl(url: string): string {
    return this.getOptimizedUrl(url, 800, 1067);
  }

  /**
   * Miniature pour les listes / grilles de produits
   */
  getThumbnailUrl(url: string): string {
    return this.getOptimizedUrl(url, 200, 200);
  }

  /**
   * Retourne l'URL de l'image primaire d'un produit (ou première image dispo)
   */
  getPrimaryImageUrl(
    images: { url: string; isPrimary?: boolean }[] | undefined | null,
    size: "product" | "thumb" = "thumb",
  ): string | null {
    if (!images || images.length === 0) return null;
    const primary = images.find((img) => img.isPrimary) || images[0];
    return size === "product"
      ? this.getProductUrl(primary.url)
      : this.getThumbnailUrl(primary.url);
  }
}
