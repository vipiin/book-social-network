package com.bsn.book.history;

import com.bsn.book.book.Book;
import com.bsn.book.common.BaseEntity;
import com.bsn.book.user.User;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class BookTransactionHistory extends BaseEntity {
    // user relationship
    // book relatiosnship
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    @ManyToOne
    @JoinColumn(name = "book_id")
    private Book book;

    private boolean returned;
    private boolean returnApproved;

}
