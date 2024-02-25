import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TasksComponent } from '../tasks/tasks.component';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { TaskDetailComponent } from '../task-detail/task-detail.component';
import { LoginComponent } from '../login/login.component';

const routes: Routes = [
  { path: "tasks", component: TasksComponent },
  { path: "dashboard", component: DashboardComponent },
  { path: "login", component: LoginComponent },
  { path: "detail/:id", component: TaskDetailComponent },
  { path: "", redirectTo: "/dashboard", pathMatch: "full" }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
