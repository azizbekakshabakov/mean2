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
    this.getTask();
  }

  getTask(): void {
    const id = this.route.snapshot.paramMap.get("id");
    this.taskService.getTask(id!).subscribe(task => this.task = task);
    console.log(this.task);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if (this.task && this.task.description) {
      this.taskService.updateTask(this.task)
        .subscribe(() => this.goBack());
    }
  }
}
