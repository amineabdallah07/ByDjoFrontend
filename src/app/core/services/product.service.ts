import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Product, Category, PagedResponse } from "../models/interfaces";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class ProductService {
  constructor(private api: ApiService) {}

  getProducts(
    page = 0,
    size = 12,
    sort = "createdAt",
    direction = "DESC",
  ): Observable<PagedResponse<Product>> {
    return this.api.get(
      `products?page=${page}&size=${size}&sort=${sort}&direction=${direction}`,
    );
  }

  searchProducts(
    query?: string,
    categoryId?: number,
    page = 0,
    size = 12,
    isNew = false,
    onSale = false,
  ): Observable<PagedResponse<Product>> {
    let url = `products/search?page=${page}&size=${size}`;
    if (query) url += `&q=${encodeURIComponent(query)}`;
    if (categoryId) url += `&category=${categoryId}`;
    if (isNew) url += `&isNew=true`;
    if (onSale) url += `&onSale=true`;
    return this.api.get(url);
  }

  getProductById(id: number): Observable<Product> {
    return this.api.get(`products/${id}`);
  }

  getProductBySlug(slug: string): Observable<Product> {
    return this.api.get(`products/slug/${slug}`);
  }

  getFeaturedProducts(): Observable<Product[]> {
    return this.api.get("products/featured");
  }

  getNewArrivals(): Observable<Product[]> {
    return this.api.get("products/new-arrivals");
  }

  getBestSellers(): Observable<Product[]> {
    return this.api.get("products/best-sellers");
  }

  getFlashSaleProducts(): Observable<Product[]> {
    return this.api.get("products/flash-sale");
  }

  getCategories(): Observable<Category[]> {
    return this.api.get("categories");
  }

  getSizes(): Observable<{ id: number; name: string }[]> {
    return this.api.get("sizes");
  }

  getWishlist(): Observable<Product[]> {
    return this.api.get("wishlist");
  }

  // ===== Admin methods =====

  createProduct(data: any): Observable<Product> {
    return this.api.post("products", data);
  }

  updateProduct(id: number, data: any): Observable<Product> {
    return this.api.put(`products/${id}`, data);
  }

  deleteProduct(id: number): Observable<any> {
    return this.api.delete(`products/${id}`);
  }

  /**
   * Upload images via FormData (fallback ou si le backend gère ça directement)
   */
  uploadImages(
    productId: number,
    files: File[],
    primaryIndex?: number,
  ): Observable<Product> {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    if (primaryIndex !== undefined)
      formData.append("primaryIndex", primaryIndex.toString());
    return this.api.upload(`products/${productId}/images`, formData);
  }

  /**
   * Envoyer des URLs Cloudinary déjà uploadées au backend
   * Le backend les stocke directement en DB (pas besoin de re-uploader)
   */
  addImageUrls(
    productId: number,
    images: { url: string; isPrimary: boolean }[],
  ): Observable<Product> {
    return this.api.post(`products/${productId}/images/urls`, { images });
  }

  /**
   * Supprimer une image d'un produit
   */
  deleteImage(productId: number, imageId: number): Observable<any> {
    return this.api.delete(`products/${productId}/images/${imageId}`);
  }
}
