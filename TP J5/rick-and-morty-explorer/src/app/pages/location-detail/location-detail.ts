import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { ErrorMessage } from '../../components/error-message/error-message';
import { Loader } from '../../components/loader/loader';
import { CharacterService } from '../../services/character';
import { LocationService } from '../../services/location';
import { TruncatePipe } from '../../pipes/truncate-pipe';

@Component({
  selector: 'app-location-detail',
  imports: [AsyncPipe, RouterLink, Loader, ErrorMessage, TruncatePipe],
  templateUrl: './location-detail.html',
  styleUrl: './location-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationDetail {
  private readonly locationService = inject(LocationService);
  private readonly characterService = inject(CharacterService);

  id = input.required<string>();

  vm$ = of(this.id).pipe(
    map(() => Number(this.id())),
    switchMap((id) =>
      this.locationService.getById(id).pipe(
        switchMap((location) => {
          const residentIds = location.residents
            .map((url) => Number(url.split('/').filter(Boolean).pop()))
            .filter((value) => Number.isFinite(value));

          return this.characterService.getMany(residentIds).pipe(
            map((residents) => ({ loading: false, error: null as string | null, location, residents })),
          );
        }),
        startWith({ loading: true, error: null as string | null, location: null, residents: [] }),
        catchError(() =>
          of({
            loading: false,
            error: 'Impossible de charger ce lieu.',
            location: null,
            residents: [],
          }),
        ),
      ),
    ),
  );
}
