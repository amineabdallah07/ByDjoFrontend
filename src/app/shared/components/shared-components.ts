import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-center py-20">
      <div class="relative">
        <div class="w-12 h-12 border-4 border-dark-700 rounded-full"></div>
        <div class="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
      </div>
    </div>
  `
})
export class LoadingSpinnerComponent {}

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="text-center py-16">
      <div class="text-6xl mb-4">{{ icon }}</div>
      <h3 class="text-dark-300 text-xl font-bold mb-2">{{ title }}</h3>
      <p class="text-dark-500 mb-6">{{ message }}</p>
      <ng-content></ng-content>
    </div>
  `
})
export class EmptyStateComponent {
  @Input() icon = '📦';
  @Input() title = 'Aucun résultat';
  @Input() message = 'Aucun élément à afficher pour le moment.';
}

@Component({
  selector: 'app-price-display',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center gap-2">
      <span class="text-primary-400 font-bold" [class]="sizeClass">{{ price.toFixed(3) }} TND</span>
      @if (comparePrice && comparePrice > price) {
        <span class="text-dark-500 line-through text-sm">{{ comparePrice.toFixed(3) }}</span>
      }
    </div>
  `
})
export class PriceDisplayComponent {
  @Input() price = 0;
  @Input() comparePrice?: number;
  @Input() sizeClass = '';
}

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="badgeClass" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
      {{ label }}
    </span>
  `
})
export class StatusBadgeComponent {
  @Input() status = '';

  get label(): string {
    const labels: Record<string, string> = {
      PENDING: 'En attente',
      CONFIRMED: 'Confirmée',
      PREPARING: 'En préparation',
      SHIPPED: 'Expédiée',
      DELIVERED: 'Livrée',
      CANCELLED: 'Annulée'
    };
    return labels[this.status] || this.status;
  }

  get badgeClass(): string {
    const classes: Record<string, string> = {
      PENDING: 'bg-primary-500/10 text-primary-400 border border-primary-500/20',
      CONFIRMED: 'bg-primary-500/10 text-primary-400 border border-primary-500/20',
      PREPARING: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
      SHIPPED: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
      DELIVERED: 'bg-green-500/10 text-green-400 border border-green-500/20',
      CANCELLED: 'bg-red-500/10 text-red-400 border border-red-500/20',
    };
    return classes[this.status] || 'bg-dark-700 text-dark-300';
  }
}
