import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { PokemonApiService } from '../../services/pokemon-api';

@Component({
  selector: 'app-pokemon-list',
  imports: [RouterLink],
  templateUrl: './pokemon-list.html',
  styleUrl: './pokemon-list.scss',
})
export class PokemonList {
  private api = inject(PokemonApiService);

  pokemons = toSignal(this.api.getList(), { initialValue: [] });
  recherche = signal('');

  filtres = computed(() => {
    const query = this.recherche().toLowerCase().trim();
    return this.pokemons().filter((pokemon) => pokemon.name.includes(query));
  });

  onSearch(event: Event) {
    this.recherche.set((event.target as HTMLInputElement).value);
  }
}
