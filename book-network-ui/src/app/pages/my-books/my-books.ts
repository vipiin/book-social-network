import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { BookService } from '../../services/services';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { BookResponse, PageResponseBookResponse } from '../../services/models';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { BookCard } from '../../modules/book/components/book-card/book-card';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-my-books',
  imports: [BookCard, CommonModule, RouterLink],
  templateUrl: './my-books.html',
  styleUrl: './my-books.scss',
})
export class MyBooks implements OnInit{
editBook(book: BookResponse) {
  this.router.navigate(['books','manage',book.id])
}
shareBook(book: BookResponse) {
  this.bookService.updateShareableStatus({
    'book-id': book.id as number
  }).then((res)=>{
    book.shareable=!book.shareable;
    this.changedecref.detectChanges();
  })
}
archiveBook(book: BookResponse) {
this.bookService.updateArchivedStatus({
  "book-id":book.id as number
}).then((res)=>{
  book.archived=!book.archived;
  this.changedecref.detectChanges();
})
}
private platformId = inject(PLATFORM_ID);
  bookResponse = signal<PageResponseBookResponse>({});
  page = 0;
  size = 4;
  goToLastPage() {
    this.page = this.bookResponse().totalPages as number - 1;
    this.findAllBooks();
  }
  goToNextPage() {
    this.page++;
    this.findAllBooks();
  }
  goToPage(arg0: number) {
    this.page = arg0;
    this.findAllBooks();
  }
  goToPreviousPage() {
    this.page--;
    this.findAllBooks();
  }
  goToFirstPage() {
    this.page = 0;
    this.findAllBooks();
  }

  constructor(
    private bookService: BookService,
    private router: Router,
    private changedecref: ChangeDetectorRef

  ) {

  }
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.fetchBooks();
      // Re-fetch data whenever the router navigation ends
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        this.fetchBooks();
      });
    }
  }

  private fetchBooks() {
    if (this.router.url.includes('my-books')) {
      this.findAllBooksByOwner();
    } else {
      this.findAllBooks();
    }
  }

  private findAllBooks() {
    this.bookService.findAllBooksByOwner(
      {
        page: this.page,
        size: this.size
      }
    ).then((res) => {
      this.bookResponse.set(res);
    }
    )
  }

  private findAllBooksByOwner() {
    this.bookService.findAllBooksByOwner(
      {
        page: this.page,
        size: this.size
      }
    ).then((res) => {
      this.bookResponse.set(res);
    }
    )
  }
  get isLastPage(): boolean {
    return this.page == this.bookResponse().totalPages as number - 1;
  }
}
