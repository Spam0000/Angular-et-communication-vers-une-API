import { Routes } from '@angular/router';
import { PokemonList } from './component/pokemon-list/pokemon-list';
import { PokemonDetail } from './component/pokemon-detail/pokemon-detail';
import { Favoris } from './component/favoris/favoris';

export const routes: Routes = [
	{ path: '', component: PokemonList },
	{ path: 'pokemon/:name', component: PokemonDetail },
	{ path: 'favoris', component: Favoris },
	{ path: '**', redirectTo: '' },
];
