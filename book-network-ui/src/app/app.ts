import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeartbeatService } from './services/heartbeat.service';

import { LoaderComponent } from './modules/book/components/loader/loader';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, LoaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('book-network-ui');

  constructor(private heartbeatService: HeartbeatService) { }

  ngOnInit() {
    this.heartbeatService.startHeartbeat();
  }
}
