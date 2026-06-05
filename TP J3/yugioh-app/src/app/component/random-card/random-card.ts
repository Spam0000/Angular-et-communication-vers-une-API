import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Card } from '../../models';
import { CardApiService } from '../../services/card-api.service';

@Component({
  selector: 'app-random-card',
  imports: [RouterLink],
  templateUrl: './random-card.html',
  styleUrl: './random-card.scss',
})
export class RandomCardComponent {
  private api = inject(CardApiService);

  card = signal<Card | null>(null);
  loading = signal(false);

  constructor() {
    this.tirer();
  }

  tirer() {
    this.loading.set(true);
    this.api.getRandomCard().subscribe({
      next: (card) => {
        this.card.set(card);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
