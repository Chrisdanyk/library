package cd.library.repository;

import cd.library.domain.BorrowedBook;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the BorrowedBook entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BorrowedBookRepository extends JpaRepository<BorrowedBook, Long> {
    @Query("select bb from BorrowedBook bb where bb.client.login = :#{principal.username}")
    Page<BorrowedBook> findByClientIsCurrentUser(Pageable pageable);
}
