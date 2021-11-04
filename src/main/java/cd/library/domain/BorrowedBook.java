package cd.library.domain;

import cd.library.domain.enumeration.Status;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A BorrowedBook.
 */
@Entity
@Table(name = "borrowed_book")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class BorrowedBook implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "borrow_date")
    private LocalDate borrowDate;

    @Column(name = "return_date")
    private LocalDate returnDate;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status;

    @JsonIgnoreProperties(value = { "author" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Book book;

    @OneToOne
    @JoinColumn(unique = true)
    private User client;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public BorrowedBook id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getBorrowDate() {
        return this.borrowDate;
    }

    public BorrowedBook borrowDate(LocalDate borrowDate) {
        this.setBorrowDate(borrowDate);
        return this;
    }

    public void setBorrowDate(LocalDate borrowDate) {
        this.borrowDate = borrowDate;
    }

    public LocalDate getReturnDate() {
        return this.returnDate;
    }

    public BorrowedBook returnDate(LocalDate returnDate) {
        this.setReturnDate(returnDate);
        return this;
    }

    public void setReturnDate(LocalDate returnDate) {
        this.returnDate = returnDate;
    }

    public Status getStatus() {
        return this.status;
    }

    public BorrowedBook status(Status status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Book getBook() {
        return this.book;
    }

    public void setBook(Book book) {
        this.book = book;
    }

    public BorrowedBook book(Book book) {
        this.setBook(book);
        return this;
    }

    public User getClient() {
        return this.client;
    }

    public void setClient(User user) {
        this.client = user;
    }

    public BorrowedBook client(User user) {
        this.setClient(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof BorrowedBook)) {
            return false;
        }
        return id != null && id.equals(((BorrowedBook) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "BorrowedBook{" +
            "id=" + getId() +
            ", borrowDate='" + getBorrowDate() + "'" +
            ", returnDate='" + getReturnDate() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
