import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TasksComponent } from '../tasks/tasks.component';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { TaskDetailComponent } from '../task-detail/task-detail.component';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../components/register/register.component';
import { AddAutoComponent } from '../components/add-auto/add-auto.component';
import { RentsComponent } from '../components/rents/rents.component';

const routes: Routes = [
  { path: "tasks", component: TasksComponent },
  { path: "dashboard", component: DashboardComponent },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "detail/:id", component: TaskDetailComponent },
  { path: "add-auto", component: AddAutoComponent },
  { path: "rents", component: RentsComponent },
  { path: "", redirectTo: "/tasks", pathMatch: "full" }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
