import { Component, inject } from '@angular/core';
import { CharacterCard } from '../../components/character-card/character-card';
import { FavorisService } from '../../services/favoris';

@Component({
  selector: 'app-favoris',
  imports: [CharacterCard],
  templateUrl: './favoris.html',
  styleUrl: './favoris.scss',
})
export class Favoris {
  favorisService = inject(FavorisService);
}
