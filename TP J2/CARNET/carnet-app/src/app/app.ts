import { Component } from '@angular/core';
import { ContactManager } from './component/contact-manager/contact-manager';

@Component({
  selector: 'app-root',
  imports: [ContactManager],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
