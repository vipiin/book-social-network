package com.bsn.book.book;

import com.bsn.book.common.BaseEntity;
import com.bsn.book.feedback.Feedback;
import com.bsn.book.history.BookTransactionHistory;
import com.bsn.book.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Book extends BaseEntity {
    private String title;
    private String authorName;
    private String isbn;
    private String synopsis;
    private String bookCover;
    private boolean archived;
    private boolean shareable;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    @OneToMany(mappedBy = "book")
    private List<Feedback> feedbacks;

    @OneToMany(mappedBy = "book")
    private List<BookTransactionHistory> histories;

    @Transient
    public double getRate() {
        if (feedbacks == null || feedbacks.isEmpty()) {
            return 0.0;
        }
        var rate = this.feedbacks.stream()
                .mapToDouble(Feedback::getNote)
                .average()
                .orElse(0.0);
        double roundedRate = Math.round(rate * 10.0) / 10.0;
        return roundedRate;
    }

    // Explicit getters for mapping and service usage
    @Override
    public Integer getId() {
        return super.getId();
    }

    public String getTitle() {
        return title;
    }

    public String getAuthorName() {
        return authorName;
    }

    public String getIsbn() {
        return isbn;
    }

    public String getSynopsis() {
        return synopsis;
    }

    public String getBookCover() {
        return bookCover;
    }

    public boolean isArchived() {
        return archived;
    }

    public boolean isShareable() {
        return shareable;
    }

    public User getOwner() {
        return owner;
    }

    public List<Feedback> getFeedbacks() {
        return feedbacks;
    }

    public List<BookTransactionHistory> getHistories() {
        return histories;
    }
}
