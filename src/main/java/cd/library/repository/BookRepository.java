package cd.library.repository;

import cd.library.domain.Book;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Book entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    @Query("select book from Book book where book.author.login = ?#{principal.username}")
    List<Book> findByAuthorIsCurrentUser();
}
