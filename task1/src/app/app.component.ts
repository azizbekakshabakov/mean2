import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { Item } from "./item";
import { ItemComponent } from "./item/item.component";
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, ItemComponent, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatIconModule],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
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

  get items() {
    if (this.filter === "all") {
      return this.allItems;
    }
    return this.allItems.filter((item) =>
      this.filter === "done" ? item.done : !item.done
    );
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