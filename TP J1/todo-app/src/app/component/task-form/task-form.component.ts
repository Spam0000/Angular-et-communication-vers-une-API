import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-form',
  imports: [FormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent {
  newTitle = '';

  @Output() add = new EventEmitter<string>();

  onSubmit(): void {
    if (!this.newTitle.trim()) {
      return;
    }

    this.add.emit(this.newTitle);
    this.newTitle = '';
  }
}