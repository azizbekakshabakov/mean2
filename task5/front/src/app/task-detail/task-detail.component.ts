import { Component, Input } from '@angular/core';
import { Task } from '../tasks/task.interface';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.css'
})
export class TaskDetailComponent {
  task: Task | undefined;

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private location: Location
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id")!;
    this.taskService.send('task', id);
    this.getTask();
  }

  getTask(): void {
    this.taskService.getTasks('task').subscribe((msg: any) => {
      this.task = msg;
    });
    console.log(this.task);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if (this.task && this.task.description) {
      this.taskService.send('update-task', JSON.stringify(this.task));
      this.goBack();
      // this.taskService.updateTask(this.task)
      //   .subscribe(() => this.goBack());
    }
  }
}
