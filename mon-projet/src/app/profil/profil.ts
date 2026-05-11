import { Component } from '@angular/core';

@Component({
  selector: 'app-profil',
  imports: [],
  templateUrl: './profil.html',
  styleUrl: './profil.css',
})
export class Profil {
  nom = 'Mouad';
  metier = 'Fullstack Developer & Formateur IT';
  photo = 'https://i.pravatar.cc/150?img=12';

  contacter() {
    alert(`Contacter ${this.nom}`);
  }
}
