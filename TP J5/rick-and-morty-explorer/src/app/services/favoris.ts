import { Injectable, computed, inject, signal } from '@angular/core';
import { Character } from '../models/character.model';
import { StorageService } from './storage';

@Injectable({
  providedIn: 'root',
})
export class FavorisService {
  private readonly storage = inject(StorageService);
  private readonly storageKey = 'rm-favoris';

  private readonly _favoris = signal<Character[]>(this.storage.get<Character[]>(this.storageKey) ?? []);

  favoris = this._favoris.asReadonly();
  nombre = computed(() => this._favoris().length);
  repartitionParStatus = computed(() => {
    const initial = { Alive: 0, Dead: 0, unknown: 0 };

    return this._favoris().reduce((acc, item) => {
      if (item.status === 'Alive') {
        acc.Alive += 1;
      } else if (item.status === 'Dead') {
        acc.Dead += 1;
      } else {
        acc.unknown += 1;
      }
      return acc;
    }, initial);
  });

  toggle(character: Character): void {
    this._favoris.update((list) => {
      const exists = list.some((item) => item.id === character.id);
      const nextList = exists
        ? list.filter((item) => item.id !== character.id)
        : [...list, character];

      this.storage.set(this.storageKey, nextList);
      return nextList;
    });
  }

  isFavori(id: number): boolean {
    return this._favoris().some((item) => item.id === id);
  }
}
