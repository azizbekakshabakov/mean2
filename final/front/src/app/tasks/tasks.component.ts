import { Component, SimpleChange } from '@angular/core';
import { Task } from './task.interface';
import { TaskService } from '../task.service';
import { MessageService } from '../message.service';
import { Subscription } from 'rxjs';
import { AutoService } from '../services/auto-service/auto.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})
export class TasksComponent {
  tasks: any[] = [];

  constructor(private taskService: TaskService, private autoService: AutoService, private router: Router) {}

  ngOnInit(): void {
    this.getTasks();
  }

  getTasks(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  delete(task: Task): void {
    this.taskService.deleteTask(task._id).subscribe(task => {
      this.getTasks();
    });
  }

  rent(car: any): void {
    this.autoService.rent(car._id).subscribe(task => {
      this.getTasks();
      this.router.navigate(['/tasks']);
    });
  }

  isMod() {
    if (localStorage.getItem("role") == "mod")
      return true;
    return false;
  }

  isUser() {
    if (localStorage.getItem("role") == "user")
      return true;
    return false;
  }
}