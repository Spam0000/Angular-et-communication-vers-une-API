import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Hello } from './hello/hello';
import { Profil } from './profil/profil';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Hello, Profil],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'mon-projet';
}
