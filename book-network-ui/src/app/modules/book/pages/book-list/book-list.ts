import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { BookService } from '../../../../services/services';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { BookResponse, PageResponseBookResponse } from '../../../../services/models';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { BookCard } from "../../components/book-card/book-card";
@Component({
  selector: 'app-book-list',
  imports: [CommonModule, BookCard],
  templateUrl: './book-list.html',
  styleUrl: './book-list.scss',
})
export class BookList implements OnInit {
  private platformId = inject(PLATFORM_ID);
  bookResponse = signal<PageResponseBookResponse>({});
  page = 0;
  size = 4;
  message = signal<string>('');
  level = signal<'success' | 'error'>('success');
  borrowBook(book: BookResponse) {
    this.message.set('');
    this.bookService.borrowBook(
      {
        'book-id': book.id as number
      }
    ).then((res) => {
      this.level.set('success');
      this.message.set('Book successfully added to your list');
    }).catch(error => {
      console.log(error);
      this.level.set('error');
      this.message.set(error.error?.error || 'An error occurred');
    })
  }
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
    private router: Router
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
    this.bookService.findAllBooks(
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
