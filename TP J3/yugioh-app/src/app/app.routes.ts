import { Routes } from '@angular/router';
import { CardDetailComponent } from './component/card-detail/card-detail';
import { CardListComponent } from './component/card-list/card-list';
import { DeckComponent } from './component/deck/deck';
import { RandomCardComponent } from './component/random-card/random-card';

export const routes: Routes = [
	{ path: '', component: CardListComponent },
	{ path: 'carte/:id', component: CardDetailComponent },
	{ path: 'deck', component: DeckComponent },
	{ path: 'aleatoire', component: RandomCardComponent },
	{ path: '**', redirectTo: '' },
];
