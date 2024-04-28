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
  tasks: any = [];
  tasks_: any = [];
  filter: "all" | "active" | "done" = "all";

  constructor(private taskService: TaskService,
    private messageService: MessageService) {}

  ngOnInit(): void {
    this.taskService.send('tasks', 'sometext'); // REMOVE
    this.getTasks();
  }

  switchTasks() {
    if (this.filter === "all") {
      this.tasks = this.tasks_;
    } else {
      this.tasks = this.tasks_.filter((item: any) =>
        this.filter === "done" ? item.done : !item.done
      );
    }
  }

  getTasks(): void {
    this.taskService.getTasks('tasks').subscribe((msg: any) => {
      this.tasks = this.tasks_ = msg;
    });
  }

  add(title: string, description: string): void {
    title = title.trim();
    description = description.trim();
    if (!description || !title) { return; }
    this.taskService.send('set-task', {title, description});
  }

  delete(task: any): void {
    this.taskService.send('delete-task', task._id);
  }

  changeDone(task: any): void {
    task.done = !task.done;
    console.log(task);
    this.taskService.send('update-task', JSON.stringify(task));
  }
}