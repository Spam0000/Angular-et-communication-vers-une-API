import { Component } from '@angular/core';
import { TaskListComponent } from './component/task-list/task-list.component';

@Component({
  selector: 'app-root',
  imports: [TaskListComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
}
