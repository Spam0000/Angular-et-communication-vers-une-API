import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BehaviorSubject, catchError, combineLatest, debounceTime, distinctUntilChanged, map, of, startWith, Subject, switchMap } from 'rxjs';
import { CharacterCard } from '../../components/character-card/character-card';
import { ErrorMessage } from '../../components/error-message/error-message';
import { Loader } from '../../components/loader/loader';
import { Paginator } from '../../components/paginator/paginator';
import { SearchBar } from '../../components/search-bar/search-bar';
import { CharacterService } from '../../services/character';
import { FavorisService } from '../../services/favoris';

@Component({
  selector: 'app-characters-list',
  imports: [AsyncPipe, CharacterCard, SearchBar, Paginator, Loader, ErrorMessage],
  templateUrl: './characters-list.html',
  styleUrl: './characters-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharactersList {
  private readonly service = inject(CharacterService);
  favoris = inject(FavorisService);

  private readonly page$ = new BehaviorSubject<number>(1);
  private readonly status$ = new BehaviorSubject<string>('');
  private readonly searchInput$ = new Subject<string>();
  private readonly refresh$ = new BehaviorSubject<number>(0);

  private readonly search$ = this.searchInput$.pipe(
    startWith(''),
    debounceTime(300),
    distinctUntilChanged(),
  );

  vm$ = combineLatest([this.page$, this.search$, this.status$, this.refresh$]).pipe(
    switchMap(([page, name, status]) =>
      this.service.getAll(page, name, status).pipe(
        map((response) => ({ loading: false, error: null as string | null, response, page })),
        startWith({ loading: true, error: null as string | null, response: null, page }),
        catchError((error: { status?: number }) => {
          if (error.status === 404) {
            return of({
              loading: false,
              error: null,
              response: { info: { count: 0, pages: 1, next: null, prev: null }, results: [] },
              page: 1,
            });
          }

          return of({
            loading: false,
            error: 'Impossible de charger la liste des personnages.',
            response: null,
            page,
          });
        }),
      ),
    ),
  );

  onSearch(value: string): void {
    this.page$.next(1);
    this.searchInput$.next(value);
  }

  onStatusChange(event: Event): void {
    this.page$.next(1);
    this.status$.next((event.target as HTMLSelectElement).value);
  }

  previousPage(): void {
    const nextValue = this.page$.value - 1;
    if (nextValue >= 1) {
      this.page$.next(nextValue);
    }
  }

  nextPage(totalPages: number): void {
    const nextValue = this.page$.value + 1;
    if (nextValue <= totalPages) {
      this.page$.next(nextValue);
    }
  }

  retry(): void {
    this.refresh$.next(this.refresh$.value + 1);
  }
}
