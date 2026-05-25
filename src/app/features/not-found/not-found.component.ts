import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center px-4 pt-20">
      <div class="text-center animate-fade-up">
        <p class="text-primary-400 font-black text-9xl md:text-[12rem] leading-none select-none opacity-20">404</p>
        <h1 class="text-3xl md:text-4xl font-black text-dark-100 -mt-4 mb-4">Page introuvable</h1>
        <p class="text-dark-400 text-lg mb-10 max-w-md mx-auto">
          Cette page n'existe pas ou a été déplacée. Revenez à l'accueil pour continuer vos achats.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a routerLink="/" class="btn-gold">Retour à l'accueil</a>
          <a routerLink="/shop" class="btn-secondary">Explorer la boutique</a>
        </div>
      </div>
    </div>
  `
})
export class NotFoundComponent {}
