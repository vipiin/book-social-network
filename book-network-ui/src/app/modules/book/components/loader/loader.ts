import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../../../../services/loader.service';

@Component({
    selector: 'app-loader',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div *ngIf="loaderService.isLoading()" class="loader-overlay">
      <div class="loader-animation">
        <div class="spinner"></div>
        <p>Loading...</p>
      </div>
    </div>
  `,
    styles: [`
    .loader-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(4px);
      z-index: 9999;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .loader-animation {
      text-align: center;
      color: white;
    }
    .spinner {
      width: 60px;
      height: 60px;
      border: 6px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: #3B82F6;
      animation: spin 1s ease-in-out infinite;
      margin-bottom: 1rem;
      filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.5));
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    p {
      font-family: 'Inter', sans-serif;
      font-weight: 500;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      font-size: 0.875rem;
    }
  `]
})
export class LoaderComponent {
    public readonly loaderService = inject(LoaderService);
}
