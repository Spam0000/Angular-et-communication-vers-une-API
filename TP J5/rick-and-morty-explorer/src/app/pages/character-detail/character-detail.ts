import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { ErrorMessage } from '../../components/error-message/error-message';
import { Loader } from '../../components/loader/loader';
import { CharacterService } from '../../services/character';
import { EpisodeService } from '../../services/episode';
import { StatusPipe } from '../../pipes/status-pipe';

@Component({
  selector: 'app-character-detail',
  imports: [AsyncPipe, RouterLink, Loader, ErrorMessage, StatusPipe],
  templateUrl: './character-detail.html',
  styleUrl: './character-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterDetail {
  private readonly characterService = inject(CharacterService);
  private readonly episodeService = inject(EpisodeService);

  id = input.required<string>();

  vm$ = of(this.id).pipe(
    map(() => Number(this.id())),
    switchMap((id) =>
      this.characterService.getById(id).pipe(
        switchMap((character) => {
          const episodeIds = character.episode
            .map((url) => Number(url.split('/').filter(Boolean).pop()))
            .filter((value) => Number.isFinite(value));

          return this.episodeService.getMany(episodeIds).pipe(
            map((episodes) => ({ loading: false, error: null as string | null, character, episodes })),
          );
        }),
        startWith({ loading: true, error: null as string | null, character: null, episodes: [] }),
        catchError(() =>
          of({
            loading: false,
            error: 'Impossible de charger ce personnage.',
            character: null,
            episodes: [],
          }),
        ),
      ),
    ),
  );

  toId(url: string): number {
    return Number(url.split('/').filter(Boolean).pop());
  }
}
