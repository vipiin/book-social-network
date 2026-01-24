import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { BookService } from '../../../../services/services/book.service';
import { FeedbackService } from '../../../../services/services/feedback.service';
import { PageResponseBorrowedBookResponse, BorrowedBookResponse, FeedbackRequest } from '../../../../services/models';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-return-books',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './return-books.html',
  styleUrl: './return-books.scss',
})
export class ReturnBooks implements OnInit {
  private bookService = inject(BookService);
  private feedbackService = inject(FeedbackService);
  private cdr = inject(ChangeDetectorRef);

  page: number = 0;
  size: number = 5;
  returnedBooks = signal<PageResponseBorrowedBookResponse>({});
  level = signal<string>('success');
  message = signal<string>('');
  approveBookReturn(book: BorrowedBookResponse) {
    if (!book.returned) {
      this.level.set('error');
      this.message.set('The book is not yet returned');
      return;
    }
    if (book.returnApproved) {
      return;
    }
    this.bookService.approveReturnBorrowBook({
      'book-id': book.id as number
    }).then(() => {
      this.level.set("success");
      this.message.set('Book return approved');
      this.findAllReturnedBooks();
    });
  }
  ngOnInit(): void {
    this.findAllReturnedBooks();
  }

  goToNextPage() {
    this.page++;
    this.findAllReturnedBooks();
  }

  goToPage(arg0: number) {
    this.page = arg0;
    this.findAllReturnedBooks();
  }

  goToPreviousPage() {
    this.page--;
    this.findAllReturnedBooks();
  }

  goToFirstPage() {
    this.page = 0;
    this.findAllReturnedBooks();
  }
  get isLastPage(): boolean {
    return this.page == (this.returnedBooks().totalPages as number - 1);
  }

  goToLastPage() {
    this.page = (this.returnedBooks().totalPages as number - 1);
    this.findAllReturnedBooks();
  }

  findAllReturnedBooks() {
    this.bookService.findAllReturnedBooks({
      page: this.page,
      size: this.size
    }).then((res) => {
      this.returnedBooks.set(res);
      this.cdr.detectChanges();
    });
  }
}
