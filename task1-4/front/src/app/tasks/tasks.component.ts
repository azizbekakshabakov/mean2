import { Component, SimpleChange } from '@angular/core';
import { Task } from './task.interface';
import { TaskService } from '../task.service';
import { MessageService } from '../message.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})
export class TasksComponent {
  tasks: Task[] = [];
  filter: "all" | "active" | "done" = "all";

  constructor(private taskService: TaskService, private messageService: MessageService) {}

  ngOnInit(): void {
    this.getTasks();
  }

  getTasks(): void {
    this.taskService.getTasks().subscribe(tasks => {
      if (this.filter === "all") {
        this.tasks = tasks;
      } else {
        this.tasks = tasks.filter((item) =>
          this.filter === "done" ? item.done : !item.done
        );
      }
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

  changeDone(task: Task): void {
    task.done = !task.done;
    console.log(task);
    this.taskService.updateTask(task)
      .subscribe(() => this.getTasks());
  }
}