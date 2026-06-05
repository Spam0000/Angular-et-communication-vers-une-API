import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Character } from '../../models/character.model';
import { StatusPipe } from '../../pipes/status-pipe';

@Component({
  selector: 'app-character-card',
  imports: [RouterLink, StatusPipe],
  templateUrl: './character-card.html',
  styleUrl: './character-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterCard {
  character = input.required<Character>();
  isFavori = input<boolean>(false);

  toggleFavori = output<Character>();

  onToggle(): void {
    this.toggleFavori.emit(this.character());
  }
}
