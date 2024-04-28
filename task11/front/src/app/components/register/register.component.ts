import { Component } from '@angular/core';
import { UserServiceService } from '../../services/user-service/user-service.service';
import { Router } from '@angular/router';
import { TaskService } from '../../task.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  email?: string;
  password?: string;

  constructor(private userService: UserServiceService, private router: Router, private taskService: TaskService) {
  }

  register(): void {
    if (this.email && this.password) {
      // this.userService.register(this.email, this.password)
      //   .subscribe((data: any) => {
      //     // localStorage.setItem("token", data);
      //     this.router.navigate(['/login']);
      //   });
      this.taskService.send('register', {email: this.email, password: this.password});
      this.router.navigate(['/login']);
    }
  }
}