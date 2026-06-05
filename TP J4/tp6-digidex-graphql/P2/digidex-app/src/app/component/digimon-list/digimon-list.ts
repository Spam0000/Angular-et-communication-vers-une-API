import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DigimonPage } from '../../models/digimon.model';
import { DigimonGraphqlService } from '../../services/digimon-graphql.service';
import { FavorisService } from '../../services/favoris.service';

@Component({
  selector: 'app-digimon-list',
  imports: [FormsModule, RouterLink],
  templateUrl: './digimon-list.html',
  styleUrl: './digimon-list.scss',
})
export class DigimonListComponent implements OnInit {
  private service = inject(DigimonGraphqlService);
  protected favoris = inject(FavorisService);

  page = signal<DigimonPage | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  recherche = signal('');
  pageCourante = signal(0);

  ngOnInit() {
    this.charger();
  }

  charger() {
    this.loading.set(true);
    this.error.set(null);

    const nom = this.recherche().trim() || undefined;
    this.service.getDigimons(this.pageCourante(), 20, nom).subscribe({
      next: (data) => {
        this.page.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Le serveur GraphQL (:4000) est-il lance ?');
        this.loading.set(false);
      },
    });
  }

  rechercher() {
    this.pageCourante.set(0);
    this.charger();
  }

  pagePrecedente() {
    if (this.pageCourante() > 0) {
      this.pageCourante.update((page) => page - 1);
      this.charger();
    }
  }

  pageSuivante() {
    this.pageCourante.update((page) => page + 1);
    this.charger();
  }
}
