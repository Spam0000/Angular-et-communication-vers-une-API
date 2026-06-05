import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, catchError, map, of, startWith, switchMap } from 'rxjs';
import { ErrorMessage } from '../../components/error-message/error-message';
import { Loader } from '../../components/loader/loader';
import { Paginator } from '../../components/paginator/paginator';
import { EpisodeService } from '../../services/episode';

@Component({
  selector: 'app-episodes-list',
  imports: [AsyncPipe, RouterLink, Loader, ErrorMessage, Paginator],
  templateUrl: './episodes-list.html',
  styleUrl: './episodes-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EpisodesList {
  private readonly service = inject(EpisodeService);
  private readonly page$ = new BehaviorSubject<number>(1);

  vm$ = this.page$.pipe(
    switchMap((page) =>
      this.service.getAll(page).pipe(
        map((response) => ({ loading: false, error: null as string | null, response, page })),
        startWith({ loading: true, error: null as string | null, response: null, page }),
        catchError(() => of({ loading: false, error: 'Impossible de charger les episodes.', response: null, page })),
      ),
    ),
  );

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
}
