import { Routes } from '@angular/router';
import { DigimonDetailComponent } from './component/digimon-detail/digimon-detail';
import { DigimonListComponent } from './component/digimon-list/digimon-list';

export const routes: Routes = [
	{ path: '', component: DigimonListComponent },
	{ path: 'digimon/:id', component: DigimonDetailComponent },
	{ path: '**', redirectTo: '' },
];
