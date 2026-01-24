package com.bsn.book.book;

import com.bsn.book.common.PageResponse;
import com.bsn.book.exception.OperationNotPermittedException;
import com.bsn.book.exception.OperationNotPermittedException;
import com.bsn.book.file.FileStorageService;
import com.bsn.book.history.BookTransactionHistory;
import com.bsn.book.history.BookTransactionHistoryRepository;
import com.bsn.book.user.User;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class BookService {
        private final BookMapper bookMapper;
        private final BookRepository bookRepository;
        private final BookTransactionHistoryRepository bookTransactionHistoryRepository;
        private final FileStorageService fileStorageService;

        public Integer save(BookRequest request, Authentication connectedUser) {
                User user = ((User) connectedUser.getPrincipal());
                Book book;
                if (request.id() != null) {
                        book = bookRepository.findById(request.id())
                                        .orElseThrow(() -> new EntityNotFoundException(
                                                        "No book found with id:: " + request.id()));
                        if (!Objects.equals(book.getOwner().getId(), user.getId())) {
                                throw new OperationNotPermittedException("You cannot update others books");
                        }
                        book.setTitle(request.title());
                        book.setAuthorName(request.authorName());
                        book.setIsbn(request.isbn());
                        book.setSynopsis(request.synopsis());
                        book.setShareable(request.shareable());
                } else {
                        book = bookMapper.toBook(request);
                        book.setOwner(user);
                }
                return bookRepository.save(book).getId();
        }

        public BookResponse findById(Integer bookId) {
                return bookRepository.findById(bookId)
                                .map(bookMapper::toBookResponse)
                                .orElseThrow(() -> new EntityNotFoundException("No book found wiht id:: " + bookId));
        }

        public PageResponse<BookResponse> findAllBooks(int page, int size, Authentication connectedUser) {
                User user = ((User) connectedUser.getPrincipal());
                Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
                Page<Book> books = bookRepository.findAllDisplayable(pageable, user.getId());
                List<BookResponse> bookResponse = books.stream()
                                .map(bookMapper::toBookResponse)
                                .toList();
                return new PageResponse<>(
                                bookResponse,
                                books.getNumber(),
                                books.getSize(),
                                books.getTotalElements(),
                                books.getTotalPages(),
                                books.isFirst(),
                                books.isLast());
        }

        public PageResponse<BookResponse> findAllBooksByOwner(int page, int size, Authentication connectedUser) {
                User user = ((User) connectedUser.getPrincipal());
                Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
                Page<Book> books = bookRepository.findAll(BookSpecification.withOwnerId(user.getId()), pageable);
                List<BookResponse> bookResponse = books.stream()
                                .map(bookMapper::toBookResponse)
                                .toList();
                return new PageResponse<>(
                                bookResponse,
                                books.getNumber(),
                                books.getSize(),
                                books.getTotalElements(),
                                books.getTotalPages(),
                                books.isFirst(),
                                books.isLast());
        }

        public PageResponse<BorrowedBookResponse> findAllBorrowedBooks(int page, int size,
                        Authentication connectedUser) {
                User user = ((User) connectedUser.getPrincipal());
                Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
                Page<BookTransactionHistory> allBorrowedBooks = bookTransactionHistoryRepository.findAllBorrowedBook(
                                pageable,
                                user.getId());
                List<BorrowedBookResponse> bookResponse = allBorrowedBooks.stream()
                                .map(bookMapper::toBorrowedBookResponse)
                                .toList();
                return new PageResponse<>(
                                bookResponse,
                                allBorrowedBooks.getNumber(),
                                allBorrowedBooks.getSize(),
                                allBorrowedBooks.getTotalElements(),
                                allBorrowedBooks.getTotalPages(),
                                allBorrowedBooks.isFirst(),
                                allBorrowedBooks.isLast());
        }

        public PageResponse<BorrowedBookResponse> findAllReturnedBooks(int page, int size,
                        Authentication connectedUser) {
                User user = ((User) connectedUser.getPrincipal());
                Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
                Page<BookTransactionHistory> allBorrowedBooks = bookTransactionHistoryRepository.findAllReturnedBook(
                                pageable,
                                user.getId());
                List<BorrowedBookResponse> bookResponse = allBorrowedBooks.stream()
                                .map(bookMapper::toBorrowedBookResponse)
                                .toList();
                return new PageResponse<>(
                                bookResponse,
                                allBorrowedBooks.getNumber(),
                                allBorrowedBooks.getSize(),
                                allBorrowedBooks.getTotalElements(),
                                allBorrowedBooks.getTotalPages(),
                                allBorrowedBooks.isFirst(),
                                allBorrowedBooks.isLast());
        }

        public Integer updateShareableStatus(Integer bookId, Authentication connectedUser) {
                Book book = bookRepository.findById(bookId)
                                .orElseThrow(() -> new EntityNotFoundException(
                                                "No book Found with the ID:: " + bookId));
                User user = ((User) connectedUser.getPrincipal());
                if (!Objects.equals(book.getOwner().getId(), user.getId())) {
                        throw new OperationNotPermittedException("You cannot update others books shareable status");
                }
                book.setShareable(!book.isShareable());
                bookRepository.save(book);
                return bookId;
        }

        public Integer updateArchivedStatus(Integer bookId, Authentication connectedUser) {
                Book book = bookRepository.findById(bookId)
                                .orElseThrow(() -> new EntityNotFoundException(
                                                "No book Found with the ID:: " + bookId));
                User user = ((User) connectedUser.getPrincipal());
                if (!Objects.equals(book.getOwner().getId(), user.getId())) {
                        throw new OperationNotPermittedException("You cannot update others books archived status");
                }
                book.setArchived(!book.isArchived());
                bookRepository.save(book);
                return bookId;
        }

        public Integer borrowBook(Integer bookId, Authentication connectedUser) {
                Book book = bookRepository.findById(bookId)
                                .orElseThrow(() -> new EntityNotFoundException(
                                                "No book Found with the ID:: " + bookId));
                if (book.isArchived() || !book.isShareable()) {
                        throw new OperationNotPermittedException(
                                        "The requested book cannot be borrowed since it is archived or not shareable");
                }
                User user = ((User) connectedUser.getPrincipal());
                if (Objects.equals(book.getOwner().getId(), user.getId())) {
                        throw new OperationNotPermittedException("You cannot borrow your own book");
                }
                final boolean isAlreadyBorrowed = bookTransactionHistoryRepository.isAlreadyBorrowedByUser(bookId,
                                user.getId());
                if (isAlreadyBorrowed) {
                        throw new OperationNotPermittedException("the requested book is already borrowed");
                }
                BookTransactionHistory bookTransactionHistory = BookTransactionHistory.builder()
                                .user(user)
                                .book(book)
                                .returned(false)
                                .returnApproved(false)
                                .build();
                return bookTransactionHistoryRepository.save(bookTransactionHistory).getId();
        }

        public Integer returnBook(Integer bookId, Authentication connectedUser) {
                Book book = bookRepository.findById(bookId)
                                .orElseThrow(() -> new EntityNotFoundException(
                                                "No book Found with the ID:: " + bookId));
                if (book.isArchived() || !book.isShareable()) {
                        throw new OperationNotPermittedException(
                                        "The requested book cannot be borrowed since it is archived or not shareable");
                }
                User user = ((User) connectedUser.getPrincipal());
                if (Objects.equals(book.getOwner().getId(), user.getId())) {
                        throw new OperationNotPermittedException("You cannot borrow or return your own book");
                }
                BookTransactionHistory bookTransactionHistory = bookTransactionHistoryRepository
                                .findbyBookIdAndUserId(bookId, user.getId())
                                .orElseThrow(() -> new OperationNotPermittedException("You did not borrow this book"));
                bookTransactionHistory.setReturned(true);
                return bookTransactionHistoryRepository.save(bookTransactionHistory).getId();
        }

        public Integer approveReturnBorrowedBook(Integer bookId, Authentication connectedUser) {
                Book book = bookRepository.findById(bookId)
                                .orElseThrow(() -> new EntityNotFoundException(
                                                "No book Found with the ID:: " + bookId));
                if (book.isArchived() || !book.isShareable()) {
                        throw new OperationNotPermittedException(
                                        "The requested book cannot be borrowed since it is archived or not shareable");
                }
                User user = ((User) connectedUser.getPrincipal());
                if (!Objects.equals(book.getOwner().getId(), user.getId())) {
                        throw new OperationNotPermittedException(
                                        "You cannot approve the return of a book you do not own");
                }
                BookTransactionHistory bookTransactionHistory = bookTransactionHistoryRepository
                                .findbyBookIdAndOwnerId(bookId, user.getId())
                                .orElseThrow(() -> new OperationNotPermittedException(
                                                "the book is not returned yet.You cannot approve its return."));
                bookTransactionHistory.setReturnApproved(true);
                return bookTransactionHistoryRepository.save(bookTransactionHistory).getId();
        }

        public void uploadBookCoverPicture(MultipartFile file, Authentication connectedUser, Integer bookId) {
                Book book = bookRepository.findById(bookId)
                                .orElseThrow(() -> new EntityNotFoundException(
                                                "No book Found with the ID:: " + bookId));
                User user = ((User) connectedUser.getPrincipal());
                var bookCover = fileStorageService.saveFile(file, user.getId());
                book.setBookCover(bookCover);
                bookRepository.save(book);
        }
}
