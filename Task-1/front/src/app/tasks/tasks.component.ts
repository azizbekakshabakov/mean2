import { Component } from '@angular/core';
import { Task } from './task.interface';
import { TaskService } from '../task.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent {
  tasks: Task[] = [];

  constructor(private taskService: TaskService, private messageService: MessageService) {}

  ngOnInit(): void {
    this.getTasks();
  }

  getTasks(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  add(description: string): void {
    description = description.trim();
    if (!description) { return; }
    this.taskService.addTask({ description } as Task)
      .subscribe(task => {
        this.getTasks();
      });
  }

  delete(task: Task): void {
    this.taskService.deleteTask(task._id).subscribe(task => {
      this.getTasks();
    });
  }
}
