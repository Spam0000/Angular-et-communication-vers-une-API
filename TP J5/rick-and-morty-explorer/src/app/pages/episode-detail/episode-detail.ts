import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { ErrorMessage } from '../../components/error-message/error-message';
import { Loader } from '../../components/loader/loader';
import { CharacterService } from '../../services/character';
import { EpisodeService } from '../../services/episode';
import { TruncatePipe } from '../../pipes/truncate-pipe';

@Component({
  selector: 'app-episode-detail',
  imports: [AsyncPipe, RouterLink, Loader, ErrorMessage, TruncatePipe],
  templateUrl: './episode-detail.html',
  styleUrl: './episode-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EpisodeDetail {
  private readonly episodeService = inject(EpisodeService);
  private readonly characterService = inject(CharacterService);

  id = input.required<string>();

  vm$ = of(this.id).pipe(
    map(() => Number(this.id())),
    switchMap((id) =>
      this.episodeService.getById(id).pipe(
        switchMap((episode) => {
          const characterIds = episode.characters
            .map((url) => Number(url.split('/').filter(Boolean).pop()))
            .filter((value) => Number.isFinite(value));

          return this.characterService.getMany(characterIds).pipe(
            map((characters) => ({ loading: false, error: null as string | null, episode, characters })),
          );
        }),
        startWith({ loading: true, error: null as string | null, episode: null, characters: [] }),
        catchError(() =>
          of({
            loading: false,
            error: 'Impossible de charger cet episode.',
            episode: null,
            characters: [],
          }),
        ),
      ),
    ),
  );
}
