import { Pipe, PipeTransform, inject } from '@angular/core';
import { I18nService } from '../../core/services/i18n.service';

/**
 * Usage in templates:
 *   {{ 'nav.shop' | translate }}
 *   {{ i18n.t().home.shopNow }}   (signal-based, reactive)
 */
@Pipe({
  name: 'translate',
  standalone: true,
  pure: false, // needs to re-evaluate when language changes
})
export class TranslatePipe implements PipeTransform {
  private i18n = inject(I18nService);

  transform(key: string): string {
    return this.i18n.translate(key);
  }
}
