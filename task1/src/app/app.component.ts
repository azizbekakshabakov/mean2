import { CommonModule } from "@angular/common";
import { Component, Injectable } from "@angular/core";
import { Item } from "./item";
import { ItemComponent } from "./item/item.component";
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import { HttpClient } from "@angular/common/http";
import { from, Observable } from 'rxjs';

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, ItemComponent, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatIconModule, MatButtonToggleModule, MatDividerModule, MatListModule],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
@Injectable({
  providedIn: 'root'
})
export class AppComponent {
  title = "todo";

  filter: "all" | "active" | "done" = "all";

  allItems = [
    { description: "eat", done: true },
    { description: "sleep", done: false },
    { description: "play", done: true },
    { description: "laugh", done: false },
  ];

  tasks:any;
  ngOnInit(): void {
    this.tasks = this.items();
  }

  click() {
    console.log(this.tasks);
  }

  constructor(private httpClient: HttpClient) {}

  items() {
    // const data = from(this.giveItems());

    // data.subscribe({
    //   next(response) { console.log(response); return response },
    //   error(err) { console.error('Error: ' + err); },
    //   complete() { console.log('Completed'); }
    // });

    console.log(111111111111);

    let dat;
    this.httpClient.get('http://localhost:3000/task')
      .subscribe({
        next(response) { console.log(response); dat = response },
        error(err) { console.error('Error: ' + err); },
        complete() { console.log('Completed'); }
      });
    return dat;

    // if (this.filter === "all") {
    //   return this.allItems;
    // }
    // return this.allItems.filter((item) =>
    //   this.filter === "done" ? item.done : !item.done
    // );
  }

  giveItems() {
    return this.httpClient.get<Item[]>('http://localhost:3000/task');
  }

  addItem(description: string) {
    if (description) {
      this.allItems.unshift({
        description,
        done: false
      });
    }
  }

  remove(item: Item) {
    this.allItems.splice(this.allItems.indexOf(item), 1);
  }  
}