import { Component } from '@angular/core';
import { UserServiceService } from '../services/user-service/user-service.service';
import { Router } from '@angular/router';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email?: string;
  password?: string;

  constructor(private userService: UserServiceService, private router: Router, private taskService: TaskService) {
  }

  login(): void {
    if (this.email && this.password) {
      // this.userService.login(this.email, this.password)
      //   .subscribe((data: any) => {
      //     localStorage.setItem("token", data);
      //     this.router.navigate(['/tasks']);
      //   });
      this.taskService.send('auth', {email: this.email, password: this.password});
      this.router.navigate(['/tasks']);

      this.taskService.getTasks('token').subscribe((msg: any) => {
        localStorage.setItem("token", msg);
      });
    }
  }
}
