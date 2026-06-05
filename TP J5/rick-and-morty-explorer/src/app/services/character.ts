import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { Character } from '../models/character.model';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://rickandmortyapi.com/api/character';

  getAll(page: number, name?: string, status?: string): Observable<ApiResponse<Character>> {
    let params = new HttpParams().set('page', page);

    if (name && name.trim()) {
      params = params.set('name', name.trim());
    }

    if (status && status.trim()) {
      params = params.set('status', status.trim());
    }

    return this.http.get<ApiResponse<Character>>(this.baseUrl, { params });
  }

  getById(id: number): Observable<Character> {
    return this.http.get<Character>(`${this.baseUrl}/${id}`);
  }

  getMany(ids: number[]): Observable<Character[]> {
    if (!ids.length) {
      return of([]);
    }

    if (ids.length === 1) {
      return this.getById(ids[0]).pipe(map((character) => [character]));
    }

    return this.http.get<Character[]>(`${this.baseUrl}/${ids.join(',')}`);
  }
}
