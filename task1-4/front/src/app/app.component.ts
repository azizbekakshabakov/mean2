import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Список задач';

  constructor(private router: Router) {
  }

  isToken(): boolean {
    if (localStorage.getItem("token")) return true;
    return false;
  }

  logout(): void {
    localStorage.removeItem("token");
    this.router.navigate(['/login']);
  }
}
