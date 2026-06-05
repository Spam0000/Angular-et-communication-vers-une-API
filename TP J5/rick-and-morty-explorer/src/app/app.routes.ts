import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { CharactersList } from './pages/characters-list/characters-list';
import { CharacterDetail } from './pages/character-detail/character-detail';
import { LocationsList } from './pages/locations-list/locations-list';
import { LocationDetail } from './pages/location-detail/location-detail';
import { EpisodesList } from './pages/episodes-list/episodes-list';
import { EpisodeDetail } from './pages/episode-detail/episode-detail';
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'dashboard' },
	{ path: 'dashboard', component: Dashboard },
	{ path: 'characters', component: CharactersList },
	{ path: 'characters/:id', component: CharacterDetail },
	{ path: 'locations', component: LocationsList },
	{ path: 'locations/:id', component: LocationDetail },
	{ path: 'episodes', component: EpisodesList },
	{ path: 'episodes/:id', component: EpisodeDetail },
	{
		path: 'favoris',
		loadComponent: () => import('./pages/favoris/favoris').then((m) => m.Favoris),
	},
	{
		path: 'contact',
		loadComponent: () => import('./pages/contact/contact').then((m) => m.Contact),
	},
	{ path: '**', component: NotFound },
];
