import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { catchError, forkJoin, map, of } from 'rxjs';
import { CharacterService } from '../../services/character';
import { EpisodeService } from '../../services/episode';
import { FavorisService } from '../../services/favoris';
import { LocationService } from '../../services/location';
import { ErrorMessage } from '../../components/error-message/error-message';

@Component({
  selector: 'app-dashboard',
  imports: [AsyncPipe, ErrorMessage],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {
  private readonly characterService = inject(CharacterService);
  private readonly locationService = inject(LocationService);
  private readonly episodeService = inject(EpisodeService);

  favorisService = inject(FavorisService);

  vm$ = forkJoin({
    characters: this.characterService.getAll(1).pipe(map((res) => res.info.count)),
    locations: this.locationService.getAll(1).pipe(map((res) => res.info.count)),
    episodes: this.episodeService.getAll(1).pipe(map((res) => res.info.count)),
  }).pipe(
    map((totals) => ({ loading: false, error: null as string | null, totals })),
    catchError(() =>
      of({
        loading: false,
        error: 'Impossible de charger les statistiques globales.',
        totals: { characters: 0, locations: 0, episodes: 0 },
      }),
    ),
  );
}
