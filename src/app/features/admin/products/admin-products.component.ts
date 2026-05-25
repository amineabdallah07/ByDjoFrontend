import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ProductService } from "../../../core/services/product.service";
import { CloudinaryService } from "../../../core/services/cloudinary.service";
import {
  Product,
  Category,
  PagedResponse,
} from "../../../core/models/interfaces";

@Component({
  selector: "app-admin-products",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 class="text-3xl font-black text-dark-100">Produits</h1>
          <p class="text-dark-400 text-sm mt-1">
            {{ totalElements }} produit(s) au total
          </p>
        </div>
        <button
          (click)="openCreateModal()"
          class="btn-primary flex items-center gap-2"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Ajouter un produit
        </button>
      </div>

      <!-- Filters -->
      <div class="glass rounded-2xl p-4 flex flex-col sm:flex-row gap-4">
        <div class="relative flex-1">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (keyup.enter)="search()"
            placeholder="Rechercher un produit..."
            class="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-2.5 text-dark-100 placeholder-dark-500 focus:border-primary-500 focus:outline-none pl-10"
          />
          <svg
            class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-dark-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <select
          [(ngModel)]="selectedCategory"
          (change)="search()"
          class="bg-dark-800 border border-dark-700 rounded-xl px-4 py-2.5 text-dark-300 focus:border-primary-500 focus:outline-none"
        >
          <option value="">Toutes les catégories</option>
          @for (cat of categories; track cat.id) {
            <option [value]="cat.id">{{ cat.name }}</option>
          }
        </select>
        <select
          [(ngModel)]="filterStatus"
          (change)="search()"
          class="bg-dark-800 border border-dark-700 rounded-xl px-4 py-2.5 text-dark-300 focus:border-primary-500 focus:outline-none"
        >
          <option value="">Tous les statuts</option>
          <option value="active">Actifs</option>
          <option value="inactive">Inactifs</option>
          <option value="featured">Mis en avant</option>
          <option value="flash">Flash Sale</option>
          <option value="lowstock">Stock faible</option>
        </select>
      </div>

      <!-- Products Table -->
      <div class="glass rounded-2xl overflow-hidden">
        @if (loading) {
          <div class="p-12 text-center text-dark-500">
            <div
              class="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"
            ></div>
            Chargement...
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="text-left border-b border-dark-800 bg-dark-900/50">
                  <th
                    class="p-4 text-dark-400 text-xs font-medium uppercase tracking-wider"
                  >
                    Produit
                  </th>
                  <th
                    class="p-4 text-dark-400 text-xs font-medium uppercase tracking-wider"
                  >
                    Catégorie
                  </th>
                  <th
                    class="p-4 text-dark-400 text-xs font-medium uppercase tracking-wider"
                  >
                    Prix
                  </th>
                  <th
                    class="p-4 text-dark-400 text-xs font-medium uppercase tracking-wider"
                  >
                    Stock
                  </th>
                  <th
                    class="p-4 text-dark-400 text-xs font-medium uppercase tracking-wider"
                  >
                    Tags
                  </th>
                  <th
                    class="p-4 text-dark-400 text-xs font-medium uppercase tracking-wider"
                  >
                    Statut
                  </th>
                  <th
                    class="p-4 text-dark-400 text-xs font-medium uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                @for (product of products; track product.id) {
                  <tr
                    class="border-b border-dark-800/50 hover:bg-dark-800/20 transition-colors"
                  >
                    <td class="p-4">
                      <div class="flex items-center gap-3">
                        <div
                          class="w-12 h-12 bg-dark-800 rounded-xl overflow-hidden shrink-0"
                        >
                          @if (getPrimaryImage(product)) {
                            <img
                              [src]="getThumb(getPrimaryImage(product)!)"
                              [alt]="product.name"
                              class="w-full h-full object-cover"
                              (error)="onImgError($event)"
                            />
                          } @else {
                            <div
                              class="w-full h-full flex items-center justify-center text-dark-600"
                            >
                              <svg
                                class="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="1"
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                          }
                        </div>
                        <div>
                          <p class="text-dark-100 font-medium text-sm">
                            {{ product.name }}
                          </p>
                          <p class="text-dark-500 text-xs">
                            {{ product.sku || "Pas de SKU" }}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td class="p-4 text-dark-300 text-sm">
                      {{ product.category?.name || "-" }}
                    </td>
                    <td class="p-4">
                      <div>
                        <span class="text-primary-400 font-semibold text-sm"
                          >{{ product.price?.toFixed(3) }} TND</span
                        >
                        @if (product.compareAtPrice) {
                          <span
                            class="text-dark-500 text-xs line-through ml-2"
                            >{{ product.compareAtPrice?.toFixed(3) }}</span
                          >
                        }
                      </div>
                    </td>
                    <td class="p-4">
                      <span
                        [class]="getStockClass(getAvailableStock(product))"
                        class="text-sm font-medium"
                        >{{ getAvailableStock(product) }}</span
                      >
                    </td>
                    <td class="p-4">
                      <div class="flex flex-wrap gap-1">
                        @if (product.featured) {
                          <span
                            class="text-xs bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded"
                            >⭐</span
                          >
                        }
                        @if (product.isNew) {
                          <span
                            class="text-xs bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded"
                            >New</span
                          >
                        }
                        @if (product.bestseller) {
                          <span
                            class="text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded"
                            >Best</span
                          >
                        }
                        @if (product.flashSale) {
                          <span
                            class="text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded"
                            >Flash</span
                          >
                        }
                      </div>
                    </td>
                    <td class="p-4">
                      <span
                        [class]="
                          product.active
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        "
                        class="text-xs px-2 py-1 rounded-lg font-medium"
                      >
                        {{ product.active ? "Actif" : "Inactif" }}
                      </span>
                    </td>
                    <td class="p-4">
                      <div class="flex items-center gap-2">
                        <button
                          (click)="openEditModal(product)"
                          class="text-dark-400 hover:text-primary-400 transition-colors p-1.5 hover:bg-primary-500/10 rounded-lg"
                          title="Modifier"
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
                        </button>
                        <button
                          (click)="toggleActive(product)"
                          class="text-dark-400 hover:text-yellow-400 transition-colors p-1.5 hover:bg-yellow-500/10 rounded-lg"
                          [title]="product.active ? 'Désactiver' : 'Activer'"
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
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                            />
                          </svg>
                        </button>
                        <button
                          (click)="confirmDelete(product)"
                          class="text-dark-400 hover:text-red-400 transition-colors p-1.5 hover:bg-red-500/10 rounded-lg"
                          title="Supprimer"
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                }
                @if (products.length === 0) {
                  <tr>
                    <td colspan="7" class="p-12 text-center text-dark-500">
                      Aucun produit trouvé
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          @if (totalPages > 1) {
            <div
              class="flex items-center justify-between p-4 border-t border-dark-800"
            >
              <p class="text-dark-400 text-sm">
                Page {{ currentPage + 1 }} sur {{ totalPages }}
              </p>
              <div class="flex gap-2">
                <button
                  (click)="changePage(currentPage - 1)"
                  [disabled]="currentPage === 0"
                  class="px-3 py-1.5 rounded-lg bg-dark-800 text-dark-300 disabled:opacity-40 hover:bg-dark-700 text-sm transition-colors"
                >
                  ← Précédent
                </button>
                <button
                  (click)="changePage(currentPage + 1)"
                  [disabled]="currentPage >= totalPages - 1"
                  class="px-3 py-1.5 rounded-lg bg-dark-800 text-dark-300 disabled:opacity-40 hover:bg-dark-700 text-sm transition-colors"
                >
                  Suivant →
                </button>
              </div>
            </div>
          }
        }
      </div>
    </div>

    <!-- ===================== MODAL PRODUIT ===================== -->
    @if (showModal) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/75 backdrop-blur-sm"
        (click)="closeModal()"
      >
        <div
          class="glass rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
          (click)="$event.stopPropagation()"
        >
          <!-- Header -->
          <div
            class="p-6 border-b border-dark-800 flex items-center justify-between sticky top-0 bg-dark-900/95 backdrop-blur-sm"
          >
            <h2 class="text-xl font-bold text-dark-100">
              {{ editingProduct ? "Modifier le produit" : "Nouveau produit" }}
            </h2>
            <button
              (click)="closeModal()"
              class="text-dark-400 hover:text-dark-100 transition-colors"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form (ngSubmit)="saveProduct()" class="p-6 space-y-6">
            <!-- ===== IMAGES EN PREMIER (toujours visible) ===== -->
            <div>
              <label class="block text-dark-300 text-sm mb-2 font-medium">
                📸 Images du produit
                @if (!editingProduct) {
                  <span class="text-primary-400 ml-1"
                    >(uploadées vers Cloudinary après création)</span
                  >
                }
              </label>

              <!-- Zone upload -->
              <div
                class="border-2 border-dashed border-dark-700 rounded-xl p-6 text-center hover:border-primary-500/50 transition-colors cursor-pointer"
                [class.border-primary-500]="isDragging"
                (click)="fileInput.click()"
                (dragover)="onDragOver($event)"
                (dragleave)="isDragging = false"
                (drop)="onDrop($event)"
              >
                <svg
                  class="w-8 h-8 text-dark-500 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                <p class="text-dark-400 text-sm">
                  Cliquer ou glisser-déposer des images
                </p>
                <p class="text-dark-600 text-xs mt-1">
                  JPG, PNG, WEBP — Cloudinary optimise automatiquement
                </p>
                <input
                  #fileInput
                  type="file"
                  multiple
                  accept="image/*"
                  class="hidden"
                  (change)="onImagesSelected($event)"
                />
              </div>

              <!-- Aperçu des fichiers sélectionnés -->
              @if (selectedFiles.length > 0) {
                <div class="mt-3 grid grid-cols-4 gap-2">
                  @for (
                    file of selectedFiles;
                    track file.name;
                    let i = $index
                  ) {
                    <div class="relative group">
                      <img
                        [src]="previewUrls[i]"
                        class="w-full aspect-square object-cover rounded-lg border border-dark-700"
                      />
                      @if (i === 0) {
                        <span
                          class="absolute bottom-1 left-1 text-[9px] bg-primary-500 text-dark-950 font-bold px-1 rounded"
                          >PRINCIPALE</span
                        >
                      }
                      <button
                        type="button"
                        (click)="removeFile(i)"
                        class="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ✕
                      </button>
                    </div>
                  }
                </div>

                @if (uploadingImages) {
                  <div
                    class="mt-2 flex items-center gap-2 text-primary-400 text-sm"
                  >
                    <div
                      class="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"
                    ></div>
                    Upload vers Cloudinary en cours...
                  </div>
                }
              }

              <!-- Images existantes (en mode édition) -->
              @if (
                editingProduct &&
                editingProduct.images &&
                editingProduct.images.length > 0
              ) {
                <div class="mt-4">
                  <p class="text-dark-400 text-xs mb-2">Images actuelles :</p>
                  <div class="grid grid-cols-4 gap-2">
                    @for (img of editingProduct.images; track img.id) {
                      <div class="relative group">
                        <img
                          [src]="getThumb(img.url)"
                          [alt]="img.altText || 'Image'"
                          class="w-full aspect-square object-cover rounded-lg border"
                          [class.border-primary-500]="img.isPrimary"
                          [class.border-dark-700]="!img.isPrimary"
                          (error)="onImgError($event)"
                        />
                        @if (img.isPrimary) {
                          <span
                            class="absolute bottom-1 left-1 text-[9px] bg-primary-500 text-dark-950 font-bold px-1 rounded"
                            >PRINCIPALE</span
                          >
                        }
                        <button
                          type="button"
                          (click)="deleteImage(img.id)"
                          class="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Supprimer"
                        >
                          ✕
                        </button>
                      </div>
                    }
                  </div>
                </div>
              }
            </div>

            <!-- Nom & Catégorie -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-dark-300 text-sm mb-1.5"
                  >Nom du produit *</label
                >
                <input
                  [(ngModel)]="form.name"
                  name="name"
                  required
                  class="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-2.5 text-dark-100 focus:border-primary-500 focus:outline-none"
                />
              </div>
              <div>
                <label class="block text-dark-300 text-sm mb-1.5"
                  >Catégorie *</label
                >
                <select
                  [(ngModel)]="form.categoryId"
                  name="categoryId"
                  required
                  class="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-2.5 text-dark-100 focus:border-primary-500 focus:outline-none"
                >
                  <option value="">Sélectionner...</option>
                  @for (cat of categories; track cat.id) {
                    <option [value]="cat.id">{{ cat.name }}</option>
                  }
                </select>
              </div>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-dark-300 text-sm mb-1.5"
                >Description</label
              >
              <textarea
                [(ngModel)]="form.description"
                name="description"
                rows="3"
                class="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-2.5 text-dark-100 focus:border-primary-500 focus:outline-none resize-none"
              ></textarea>
            </div>

            <!-- Prix -->
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-dark-300 text-sm mb-1.5"
                  >Prix de vente (TND) *</label
                >
                <input
                  [(ngModel)]="form.price"
                  name="price"
                  type="number"
                  step="0.001"
                  min="0"
                  required
                  class="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-2.5 text-dark-100 focus:border-primary-500 focus:outline-none"
                />
              </div>
              <div>
                <label class="block text-dark-300 text-sm mb-1.5"
                  >Prix barré (TND)</label
                >
                <input
                  [(ngModel)]="form.compareAtPrice"
                  name="compareAtPrice"
                  type="number"
                  step="0.001"
                  min="0"
                  class="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-2.5 text-dark-100 focus:border-primary-500 focus:outline-none"
                />
              </div>
              <div>
                <label class="block text-dark-300 text-sm mb-1.5"
                  >Stock initial (sans tailles)</label
                >
                <input
                  [(ngModel)]="form.stock"
                  name="stock"
                  type="number"
                  min="0"
                  [disabled]="sizeStocks.length > 0"
                  class="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-2.5 text-dark-100 focus:border-primary-500 focus:outline-none disabled:opacity-40"
                />
              </div>
            </div>

            <!-- Tailles & Stock par taille -->
            <div>
              <label class="block text-dark-300 text-sm mb-3"
                >Tailles disponibles</label
              >
              <div class="flex flex-wrap gap-2 mb-3">
                @for (size of sizes; track size.id) {
                  <button
                    type="button"
                    (click)="toggleSize(size)"
                    [class]="
                      isSizeSelected(size.id)
                        ? 'px-3 py-1.5 rounded-lg text-sm font-bold border-2 border-primary-500 bg-primary-500/20 text-primary-400'
                        : 'px-3 py-1.5 rounded-lg text-sm font-medium border border-dark-600 bg-dark-800 text-dark-300 hover:border-dark-400'
                    "
                  >
                    {{ size.name }}
                  </button>
                }
              </div>
              @if (sizeStocks.length > 0) {
                <div class="space-y-2">
                  @for (entry of sizeStocks; track entry.sizeId) {
                    <div
                      class="flex items-center gap-3 bg-dark-800 rounded-xl px-4 py-2.5 border border-dark-700"
                    >
                      <span class="text-dark-100 font-bold w-12 text-center">{{
                        entry.sizeName
                      }}</span>
                      <span class="text-dark-400 text-sm flex-1">Stock :</span>
                      <input
                        type="number"
                        min="0"
                        [value]="entry.stock"
                        (input)="
                          setSizeStock(entry.sizeId, +$any($event.target).value)
                        "
                        class="w-24 bg-dark-900 border border-dark-600 rounded-lg px-3 py-1.5 text-dark-100 text-sm focus:border-primary-500 focus:outline-none text-center"
                      />
                    </div>
                  }
                </div>
              }
            </div>

            <!-- Marque & SKU -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-dark-300 text-sm mb-1.5">Marque</label>
                <input
                  [(ngModel)]="form.brand"
                  name="brand"
                  class="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-2.5 text-dark-100 focus:border-primary-500 focus:outline-none"
                />
              </div>
              <div>
                <label class="block text-dark-300 text-sm mb-1.5">SKU</label>
                <input
                  [(ngModel)]="form.sku"
                  name="sku"
                  class="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-2.5 text-dark-100 focus:border-primary-500 focus:outline-none"
                />
              </div>
            </div>

            <!-- Tags -->
            <div>
              <label class="block text-dark-300 text-sm mb-3"
                >Tags produit</label
              >
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                @for (flag of productFlags; track flag.key) {
                  <label
                    class="flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all"
                    [class]="
                      form[flag.key]
                        ? 'border-primary-500/50 bg-primary-500/10'
                        : 'border-dark-700 bg-dark-800/50'
                    "
                  >
                    <input
                      type="checkbox"
                      [(ngModel)]="form[flag.key]"
                      [name]="flag.key"
                      class="hidden"
                    />
                    <span class="text-lg">{{ flag.icon }}</span>
                    <span
                      class="text-sm"
                      [class]="
                        form[flag.key] ? 'text-primary-400' : 'text-dark-400'
                      "
                      >{{ flag.label }}</span
                    >
                  </label>
                }
              </div>
            </div>

            <!-- Actif -->
            <div class="flex items-center gap-3 p-4 bg-dark-800/50 rounded-xl">
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  [(ngModel)]="form.active"
                  name="active"
                  class="sr-only peer"
                />
                <div
                  class="w-11 h-6 bg-dark-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-dark-700 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"
                ></div>
              </label>
              <div>
                <p class="text-dark-100 text-sm font-medium">Produit actif</p>
                <p class="text-dark-500 text-xs">Visible sur le site public</p>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-3 pt-2">
              <button
                type="button"
                (click)="closeModal()"
                class="flex-1 px-4 py-3 rounded-xl bg-dark-800 text-dark-300 hover:bg-dark-700 transition-colors font-medium"
              >
                Annuler
              </button>
              <button
                type="submit"
                [disabled]="saving || uploadingImages"
                class="flex-1 btn-primary flex items-center justify-center gap-2"
              >
                @if (saving || uploadingImages) {
                  <div
                    class="w-4 h-4 border-2 border-dark-900/50 border-t-dark-950 rounded-full animate-spin"
                  ></div>
                }
                {{ editingProduct ? "Mettre à jour" : "Créer le produit" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }

    <!-- Delete Confirmation Modal -->
    @if (productToDelete) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/75 backdrop-blur-sm"
      >
        <div class="glass rounded-2xl p-6 w-full max-w-md">
          <div class="text-center mb-6">
            <div
              class="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <svg
                class="w-8 h-8 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-dark-100 mb-2">
              Supprimer le produit ?
            </h3>
            <p class="text-dark-400 text-sm">
              <strong class="text-dark-100">{{ productToDelete.name }}</strong>
              sera définitivement supprimé.
            </p>
          </div>
          <div class="flex gap-3">
            <button
              (click)="productToDelete = null"
              class="flex-1 px-4 py-3 rounded-xl bg-dark-800 text-dark-300 hover:bg-dark-700 transition-colors font-medium"
            >
              Annuler
            </button>
            <button
              (click)="deleteProduct()"
              class="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors font-medium"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  sizes: { id: number; name: string }[] = [];
  sizeStocks: { sizeId: number; sizeName: string; stock: number }[] = [];
  loading = false;
  saving = false;
  uploadingImages = false;
  isDragging = false;
  showModal = false;
  editingProduct: Product | null = null;
  productToDelete: Product | null = null;
  searchQuery = "";
  selectedCategory = "";
  filterStatus = "";
  currentPage = 0;
  totalPages = 0;
  totalElements = 0;
  selectedFiles: File[] = [];
  previewUrls: string[] = [];

  productFlags = [
    { key: "featured", icon: "⭐", label: "Mis en avant" },
    { key: "isNew", icon: "🆕", label: "Nouveau" },
    { key: "bestseller", icon: "🔥", label: "Best Seller" },
    { key: "flashSale", icon: "⚡", label: "Flash Sale" },
  ];

  form: any = this.emptyForm();

  constructor(
    private productService: ProductService,
    private cloudinary: CloudinaryService,
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.loadSizes();
  }

  emptyForm() {
    return {
      name: "",
      description: "",
      price: null,
      compareAtPrice: null,
      categoryId: "",
      brand: "",
      sku: "",
      stock: 0,
      active: true,
      featured: false,
      isNew: false,
      bestseller: false,
      flashSale: false,
    };
  }

  loadProducts(): void {
    this.loading = true;
    const obs =
      this.searchQuery || this.selectedCategory
        ? this.productService.searchProducts(
            this.searchQuery || undefined,
            this.selectedCategory ? +this.selectedCategory : undefined,
            this.currentPage,
            20,
          )
        : this.productService.getProducts(this.currentPage, 20);

    obs.subscribe({
      next: (r) => {
        let products = r.content;
        if (this.filterStatus === "active")
          products = products.filter((p) => p.active);
        else if (this.filterStatus === "inactive")
          products = products.filter((p) => !p.active);
        else if (this.filterStatus === "featured")
          products = products.filter((p) => p.featured);
        else if (this.filterStatus === "flash")
          products = products.filter((p) => p.flashSale);
        else if (this.filterStatus === "lowstock")
          products = products.filter((p) => this.getAvailableStock(p) <= 5);
        this.products = products;
        this.totalPages = r.totalPages;
        this.totalElements = r.totalElements;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  loadCategories(): void {
    this.productService
      .getCategories()
      .subscribe({ next: (cats) => (this.categories = cats) });
  }

  loadSizes(): void {
    this.productService
      .getSizes()
      .subscribe({ next: (sizes) => (this.sizes = sizes) });
  }

  toggleSize(size: { id: number; name: string }): void {
    const idx = this.sizeStocks.findIndex((s) => s.sizeId === size.id);
    if (idx >= 0) {
      this.sizeStocks.splice(idx, 1);
    } else {
      this.sizeStocks.push({ sizeId: size.id, sizeName: size.name, stock: 0 });
    }
  }

  isSizeSelected(sizeId: number): boolean {
    return this.sizeStocks.some((s) => s.sizeId === sizeId);
  }

  getSizeStock(sizeId: number): number {
    return this.sizeStocks.find((s) => s.sizeId === sizeId)?.stock || 0;
  }

  setSizeStock(sizeId: number, stock: number): void {
    const entry = this.sizeStocks.find((s) => s.sizeId === sizeId);
    if (entry) entry.stock = stock;
  }

  search(): void {
    this.currentPage = 0;
    this.loadProducts();
  }
  changePage(page: number): void {
    this.currentPage = page;
    this.loadProducts();
  }

  openCreateModal(): void {
    this.editingProduct = null;
    this.form = this.emptyForm();
    this.clearFiles();
    this.sizeStocks = [];
    this.showModal = true;
  }

  openEditModal(product: Product): void {
    this.editingProduct = product;
    this.form = {
      name: product.name,
      description: product.description || "",
      price: product.price,
      compareAtPrice: product.compareAtPrice || null,
      categoryId: product.category?.id || "",
      brand: product.brand || "",
      sku: product.sku || "",
      stock: product.totalStock,
      active: product.active,
      featured: product.featured,
      isNew: product.isNew,
      bestseller: product.bestseller,
      flashSale: product.flashSale,
    };
    this.clearFiles();
    // Load existing size variants
    this.sizeStocks = (product.variants || [])
      .filter((v) => v.sizeId && v.active)
      .map((v) => ({
        sizeId: v.sizeId!,
        sizeName: v.sizeName || "",
        stock: v.stock,
      }));
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingProduct = null;
    this.clearFiles();
  }

  clearFiles(): void {
    this.previewUrls.forEach((u) => URL.revokeObjectURL(u));
    this.selectedFiles = [];
    this.previewUrls = [];
  }

  onImagesSelected(event: any): void {
    const files = Array.from(event.target.files) as File[];
    this.addFiles(files);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    const files = Array.from(event.dataTransfer?.files || []) as File[];
    const images = files.filter((f) => f.type.startsWith("image/"));
    this.addFiles(images);
  }

  addFiles(files: File[]): void {
    files.forEach((file) => {
      this.selectedFiles.push(file);
      this.previewUrls.push(URL.createObjectURL(file));
    });
  }

  removeFile(index: number): void {
    URL.revokeObjectURL(this.previewUrls[index]);
    this.selectedFiles.splice(index, 1);
    this.previewUrls.splice(index, 1);
  }

  saveProduct(): void {
    if (!this.form.name || !this.form.price || !this.form.categoryId) return;
    this.saving = true;

    const payload: any = {
      name: this.form.name,
      description: this.form.description,
      price: +this.form.price,
      compareAtPrice: this.form.compareAtPrice
        ? +this.form.compareAtPrice
        : null,
      categoryId: +this.form.categoryId,
      brand: this.form.brand,
      sku: this.form.sku,
      stock: this.sizeStocks.length === 0 ? +this.form.stock : 0,
      active: this.form.active,
      featured: this.form.featured,
      isNew: this.form.isNew,
      bestseller: this.form.bestseller,
      flashSale: this.form.flashSale,
      variants:
        this.sizeStocks.length > 0
          ? this.sizeStocks.map((s) => ({
              sizeId: s.sizeId,
              stock: s.stock,
              active: true,
            }))
          : undefined,
    };

    const obs = this.editingProduct
      ? this.productService.updateProduct(this.editingProduct.id, payload)
      : this.productService.createProduct(payload);

    obs.subscribe({
      next: (product) => {
        this.saving = false;

        // Si des fichiers sont sélectionnés → upload vers Cloudinary puis envoyer URLs au backend
        if (this.selectedFiles.length > 0 && product.id) {
          this.uploadingImages = true;
          this.cloudinary.uploadFiles(this.selectedFiles).subscribe({
            next: (results) => {
              // Envoyer les URLs Cloudinary au backend
              const imageUrls = results.map((r, i) => ({
                url: r.secure_url,
                isPrimary: i === 0,
              }));
              this.productService
                .addImageUrls(product.id, imageUrls)
                .subscribe({
                  next: () => {
                    this.uploadingImages = false;
                    this.closeModal();
                    this.loadProducts();
                  },
                  error: () => {
                    this.uploadingImages = false;
                    this.closeModal();
                    this.loadProducts();
                  },
                });
            },
            error: () => {
              this.uploadingImages = false;
              // Fallback: essayer l'upload direct via FormData
              this.productService
                .uploadImages(product.id, this.selectedFiles)
                .subscribe({
                  next: () => {
                    this.closeModal();
                    this.loadProducts();
                  },
                  error: () => {
                    this.closeModal();
                    this.loadProducts();
                  },
                });
            },
          });
        } else {
          this.closeModal();
          this.loadProducts();
        }
      },
      error: () => {
        this.saving = false;
      },
    });
  }

  confirmDelete(product: Product): void {
    this.productToDelete = product;
  }

  deleteProduct(): void {
    if (!this.productToDelete) return;
    this.productService.deleteProduct(this.productToDelete.id).subscribe({
      next: () => {
        this.productToDelete = null;
        this.loadProducts();
      },
    });
  }

  toggleActive(product: Product): void {
    this.productService
      .updateProduct(product.id, { active: !product.active })
      .subscribe({
        next: () => this.loadProducts(),
      });
  }

  deleteImage(imageId: number): void {
    if (!this.editingProduct) return;
    this.productService.deleteImage(this.editingProduct.id, imageId).subscribe({
      next: () => this.loadProducts(),
    });
  }

  // ===== Helpers =====

  getPrimaryImage(product: Product): string | null {
    if (!product.images || product.images.length === 0) return null;
    const primary = product.images.find((i) => i.isPrimary);
    return primary?.url || product.images[0]?.url || null;
  }

  getThumb(url: string): string {
    return this.cloudinary.getThumbnailUrl(url);
  }

  onImgError(event: any): void {
    // Masquer l'image cassée
    event.target.style.display = "none";
  }

  getStockClass(stock: number): string {
    if (stock > 10) return "text-green-400";
    if (stock > 0) return "text-yellow-400";
    return "text-red-400";
  }

  getAvailableStock(product: any): number {
    if (!product.variants || product.variants.length === 0) return product.totalStock ?? 0;
    return product.variants.reduce((sum: number, v: any) => sum + (v.stock ?? 0), 0);
  }
}
