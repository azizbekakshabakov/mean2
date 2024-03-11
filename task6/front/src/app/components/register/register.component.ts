import { Component } from '@angular/core';
import { UserServiceService } from '../../services/user-service/user-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  email?: string;
  password?: string;

  constructor(private userService: UserServiceService, private router: Router) {
  }

  register(): void {
    if (this.email && this.password) {
      this.userService.register(this.email, this.password)
        .subscribe((data: any) => {
          // localStorage.setItem("token", data);
          this.router.navigate(['/login']);
        });
    }
  }
}