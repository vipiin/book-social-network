import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgModel } from '@angular/forms';
import { BookRequest } from '../../services/models';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BookService } from '../../services/services';

@Component({
  selector: 'app-manage-book',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './manage-book.html',
  styleUrl: './manage-book.scss',
})
export class ManageBook implements OnInit {
  constructor(
    private bookService: BookService,
    private router: Router,
    private activatesRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {

  }
  ngOnInit(): void {
    const bookId = this.activatesRoute.snapshot.params['bookId'];
    if (bookId) {
      this.bookService.findBookById(
        {
          'book-id': bookId
        }
      ).then((book) => {
        this.bookRequest = {
          id: book.id,
          title: book.title as string,
          authorName: book.authorName as string,
          isbn: book.isbn as string,
          synopsis: book.synopsis as string,
          shareable: book.shareable
        };
        if (book.cover) {
          this.selectedPicture.set('data:image/jpg;base64,' + book.cover);
        }
        this.cdr.detectChanges();
      }).catch(err => {
        console.log(err);
      });
    }
  }
  async saveBook() {
    if (this.errorMsg().length > 0) {
      return;
    }
    this.errorMsg.set([]);
    try {
      const res = await this.bookService.saveBook({
        body: this.bookRequest
      });
      if (this.selectedBookCover) {
        await this.bookService.uploadBookCoverPicture({
          'book-id': res,
          body: {
            file: this.selectedBookCover
          }
        });
      }
      this.router.navigate(['/books/my-books']);
    } catch (err: any) {
      console.log(err);
      if (err.error && err.error.validationErrors) {
        this.errorMsg.set(err.error.validationErrors);
      } else {
        this.errorMsg.set([err.error?.error || 'Something went wrong']);
      }
    }
  }
  selectedBookCover: any;
  bookRequest: BookRequest = {
    authorName: '',
    isbn: '',
    synopsis: '',
    title: ''
  };
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) { // 50MB
        this.errorMsg.set(['File size exceeds the 50MB limit (50MB)']);
        this.selectedBookCover = undefined;
        this.selectedPicture.set(undefined);
        return;
      }
      this.errorMsg.set([]);
      this.selectedBookCover = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedPicture.set(reader.result as string);
      }
      reader.readAsDataURL(this.selectedBookCover);
    }
  }
  errorMsg = signal<Array<string>>([]);
  selectedPicture = signal<string | undefined>(undefined);

}
