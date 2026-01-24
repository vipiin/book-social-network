import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Menu } from "../../components/menu/menu";
@Component({
  selector: 'app-main',
  imports: [CommonModule, RouterModule, Menu],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main {

}
