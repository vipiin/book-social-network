package com.bsn.book.book;

import com.bsn.book.history.BookTransactionHistory;
import org.springframework.stereotype.Service;

@Service
public class BookMapper {
    public Book toBook(BookRequest request) {
        return Book.builder()
                .id(request.id())
                .title(request.title())
                .authorName(request.authorName())
                .synopsis(request.synopsis())
                .isbn(request.isbn())
                .archived(false)
                .shareable(request.shareable())
                .build();
    }

    public BookResponse toBookResponse(Book book) {
        return BookResponse.builder()
                .id(book.getId())
                .authorName(book.getAuthorName())
                .title(book.getTitle())
                .archived(book.isArchived())
                .owner(book.getOwner().fullName())
                .shareable(book.isShareable())
                .rate(book.getRate())
                .isbn(book.getIsbn())
                .synopsis(book.getSynopsis())
                .cover(book.getBookCover())
                .build();
    }

    public BorrowedBookResponse toBorrowedBookResponse(BookTransactionHistory bookTransactionHistory) {
        return BorrowedBookResponse.builder()
                .id(bookTransactionHistory.getBook().getId())
                .authorName(bookTransactionHistory.getBook().getAuthorName())
                .title(bookTransactionHistory.getBook().getTitle())
                .rate(bookTransactionHistory.getBook().getRate())
                .isbn(bookTransactionHistory.getBook().getIsbn())
                .returned(bookTransactionHistory.isReturned())
                .returnApproved(bookTransactionHistory.isReturnApproved())
                // .cover()
                .build();
    }
}
