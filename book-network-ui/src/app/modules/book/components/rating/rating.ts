import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rating.html',
  styleUrl: './rating.scss',
})
export class Rating {
  rating = input<number>(0);
  maxRating: number = 5;

  get fullStars(): number {
    return Math.floor(this.rating());
  }

  get hasHalfStar(): boolean {
    return this.rating() % 1 !== 0;
  }

  get emptyStars(): number {
    return this.maxRating - Math.ceil(this.rating());
  }
}
