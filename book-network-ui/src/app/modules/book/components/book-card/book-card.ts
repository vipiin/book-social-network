import { Component, computed, EventEmitter, Input, input, Output } from '@angular/core';
import { BookResponse } from '../../../../services/models';
import { CommonModule } from '@angular/common';
import { Rating } from "../rating/rating";

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [CommonModule, Rating],
  templateUrl: './book-card.html',
  styleUrl: './book-card.scss',
})
export class BookCard {

  private _bookcover: string | undefined;

  _book = input.required<BookResponse>();
  manage = input<boolean>(false);

  @Output() public share: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  @Output() public archive: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  @Output() public addToWaitingList: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  @Output() public borrow: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  @Output() public edit: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  @Output() public details: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();

  get book(): BookResponse {
    return this._book();
  }

  bookCover = computed(() => {
    const book = this._book();
    if (!book.cover) {
      return this._bookcover || 'https://picsum.photos/1900/800';
    }
    if (book.cover.startsWith('http')) {
      return book.cover;
    }
    return 'data:image/jpg;base64, ' + book.cover;
  });

  get rating(): number {
    return this.book.rate || 0;
  }

  onArchive() {
    this.archive.emit(this.book);
  }

  onShare() {
    this.share.emit(this.book);
  }

  onEdit() {
    this.edit.emit(this.book);
  }

  onAddToWaitingList() {
    this.addToWaitingList.emit(this.book);
  }

  onBorrow() {
    this.borrow.emit(this.book);
  }

  onShowDetails() {
    this.details.emit(this.book);
  }
}
