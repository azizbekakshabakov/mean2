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
    this.taskService.send('tasks', 'sometext');
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
      // if (this.filter === "all") {
      //   this.tasks = msg;
      // } else {
      //   this.tasks = msg.filter((item: any) =>
      //     this.filter === "done" ? item.done : !item.done
      //   );
      // }
    });
    // this.taskService.getTasks().subscribe(tasks => {
    //   if (this.filter === "all") {
    //     this.tasks = tasks;
    //   } else {
    //     this.tasks = tasks.filter((item) =>
    //       this.filter === "done" ? item.done : !item.done
    //     );
    //   }
    // });
  }

  add(description: string): void {
    description = description.trim();
    if (!description) { return; }
    this.taskService.send('set-task', description);
  }

  delete(task: Task): void {
    this.taskService.send('delete-task', task._id);
  }

  changeDone(task: Task): void {
    task.done = !task.done;
    console.log(task);
    // this.taskService.updateTask(task)
    //   .subscribe(() => this.getTasks());
    this.taskService.send('update-task', JSON.stringify(task));
  }
}