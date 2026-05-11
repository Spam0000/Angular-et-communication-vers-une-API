import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskItemComponent } from '../task-item/task-item.component';

type Filter = 'all' | 'active' | 'done';

@Component({
  selector: 'app-task-list',
  imports: [CommonModule, TaskFormComponent, TaskItemComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent {
  private readonly taskService = inject(TaskService);

  private readonly filterSubject = new BehaviorSubject<Filter>('all');
  readonly filter$ = this.filterSubject.asObservable();

  readonly tasks$ = this.taskService.getTasks();

  readonly stats$ = this.tasks$.pipe(
    map((tasks) => {
      const done = tasks.filter((task) => task.done).length;
      const remaining = tasks.length - done;

      return { remaining, done };
    })
  );

  readonly filteredTasks$: Observable<Task[]> = combineLatest([
    this.tasks$,
    this.filter$
  ]).pipe(
    map(([tasks, filter]) => {
      if (filter === 'active') {
        return tasks.filter((task) => !task.done);
      }

      if (filter === 'done') {
        return tasks.filter((task) => task.done);
      }

      return tasks;
    })
  );

  setFilter(filter: Filter): void {
    this.filterSubject.next(filter);
  }

  onAdd(title: string): void {
    this.taskService.addTask(title);
  }

  onToggle(id: number): void {
    this.taskService.toggleTask(id);
  }

  onDelete(id: number): void {
    this.taskService.deleteTask(id);
  }

  onClearCompleted(): void {
    this.taskService.clearCompletedTasks();
  }
}