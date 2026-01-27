import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BorrowedBookResponse, FeedbackRequest, PageResponseBorrowedBookResponse } from '../../../../services/models';
import { BookService } from '../../../../services/services/book.service';
import { FeedbackService } from '../../../../services/services/feedback.service';
import { FormsModule } from "@angular/forms";
import { Rating } from "../../components/rating/rating";

@Component({
  selector: 'app-borrowed-book-list',
  standalone: true,
  imports: [CommonModule, FormsModule, Rating],
  templateUrl: './borrowed-book-list.html',
  styleUrl: './borrowed-book-list.scss',
})
export class BorrowedBookListComponent implements OnInit {

  private bookService = inject(BookService);
  private feedbackService = inject(FeedbackService);
  private cdr = inject(ChangeDetectorRef);

  page: number = 0;
  size: number = 5;
  bookResponse = signal<PageResponseBorrowedBookResponse>({});
  selectedBook: BorrowedBookResponse | undefined = undefined;
  feedbackRequest: FeedbackRequest = {
    bookId: 0,
    comment: '',
    note: 0
  };

  ngOnInit(): void {
    this.findAllBorrowedBooks();
  }

  findAllBorrowedBooks() {
    this.bookService.findAllBorrowedBooks({
      page: this.page,
      size: this.size
    }).then((res) => {
      this.bookResponse.set(res);
      this.cdr.detectChanges();
    });
  }

  returnBorrowedBook(book: BorrowedBookResponse) {
    this.selectedBook = book;
    this.feedbackRequest.bookId = book.id as number;
  }

  returnBook(withFeedback: boolean) {
    if (withFeedback) {
      this.feedbackService.saveFeedback({
        body: this.feedbackRequest
      }).then(() => {
        this.executeReturn();
      });
    } else {
      this.executeReturn();
    }
  }

  private executeReturn() {
    this.bookService.returnBook({
      'book-id': this.selectedBook?.id as number
    }).then(() => {
      this.selectedBook = undefined;
      this.feedbackRequest = {
        bookId: 0,
        comment: '',
        note: 0
      };
      this.findAllBorrowedBooks();
      this.cdr.detectChanges();
    });
  }

  get isLastPage(): boolean {
    return this.page == this.bookResponse().totalPages as number - 1;
  }

  goToLastPage() {
    this.page = this.bookResponse().totalPages as number - 1;
    this.findAllBorrowedBooks();
  }

  goToNextPage() {
    this.page++;
    this.findAllBorrowedBooks();
  }

  goToPage(arg0: number) {
    this.page = arg0;
    this.findAllBorrowedBooks();
  }

  goToPreviousPage() {
    this.page--;
    this.findAllBorrowedBooks();
  }

  goToFirstPage() {
    this.page = 0;
    this.findAllBorrowedBooks();
  }

}
