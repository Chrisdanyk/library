package cd.library.domain;

import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Book.
 */
@Entity
@Table(name = "book")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Book implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(min = 5, max = 13)
    @Column(name = "isbn", length = 13, nullable = false, unique = true)
    private String isbn;

    @NotNull
    @Size(max = 100)
    @Column(name = "name", length = 100, nullable = false)
    private String name;

    @Size(max = 100)
    @Column(name = "publisher_name", length = 100, unique = true)
    private String publisherName;

    @Size(max = 100)
    @Column(name = "publisher_url", length = 100)
    private String publisherUrl;

    @NotNull
    @Size(min = 4, max = 50)
    @Column(name = "publish_year", length = 50, nullable = false)
    private String publishYear;

    @NotNull
    @Column(name = "copies", nullable = false)
    private Integer copies;

    @Lob
    @Column(name = "cover")
    private byte[] cover;

    @Column(name = "cover_content_type")
    private String coverContentType;

    @ManyToOne
    private User author;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Book id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIsbn() {
        return this.isbn;
    }

    public Book isbn(String isbn) {
        this.setIsbn(isbn);
        return this;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public String getName() {
        return this.name;
    }

    public Book name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPublisherName() {
        return this.publisherName;
    }

    public Book publisherName(String publisherName) {
        this.setPublisherName(publisherName);
        return this;
    }

    public void setPublisherName(String publisherName) {
        this.publisherName = publisherName;
    }

    public String getPublisherUrl() {
        return this.publisherUrl;
    }

    public Book publisherUrl(String publisherUrl) {
        this.setPublisherUrl(publisherUrl);
        return this;
    }

    public void setPublisherUrl(String publisherUrl) {
        this.publisherUrl = publisherUrl;
    }

    public String getPublishYear() {
        return this.publishYear;
    }

    public Book publishYear(String publishYear) {
        this.setPublishYear(publishYear);
        return this;
    }

    public void setPublishYear(String publishYear) {
        this.publishYear = publishYear;
    }

    public Integer getCopies() {
        return this.copies;
    }

    public Book copies(Integer copies) {
        this.setCopies(copies);
        return this;
    }

    public void setCopies(Integer copies) {
        this.copies = copies;
    }

    public byte[] getCover() {
        return this.cover;
    }

    public Book cover(byte[] cover) {
        this.setCover(cover);
        return this;
    }

    public void setCover(byte[] cover) {
        this.cover = cover;
    }

    public String getCoverContentType() {
        return this.coverContentType;
    }

    public Book coverContentType(String coverContentType) {
        this.coverContentType = coverContentType;
        return this;
    }

    public void setCoverContentType(String coverContentType) {
        this.coverContentType = coverContentType;
    }

    public User getAuthor() {
        return this.author;
    }

    public void setAuthor(User user) {
        this.author = user;
    }

    public Book author(User user) {
        this.setAuthor(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Book)) {
            return false;
        }
        return id != null && id.equals(((Book) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Book{" +
            "id=" + getId() +
            ", isbn='" + getIsbn() + "'" +
            ", name='" + getName() + "'" +
            ", publisherName='" + getPublisherName() + "'" +
            ", publisherUrl='" + getPublisherUrl() + "'" +
            ", publishYear='" + getPublishYear() + "'" +
            ", copies=" + getCopies() +
            ", cover='" + getCover() + "'" +
            ", coverContentType='" + getCoverContentType() + "'" +
            "}";
    }
}
