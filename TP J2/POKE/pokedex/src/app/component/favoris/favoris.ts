import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavorisService } from '../../services/favoris';

@Component({
  selector: 'app-favoris',
  imports: [RouterLink],
  templateUrl: './favoris.html',
  styleUrl: './favoris.scss',
})
export class Favoris {
  favoris = inject(FavorisService);
}
