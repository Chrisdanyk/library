package cd.library.service;

import cd.library.domain.BorrowedBook;
import cd.library.repository.BorrowedBookRepository;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link BorrowedBook}.
 */
@Service
@Transactional
public class BorrowedBookService {

    private final Logger log = LoggerFactory.getLogger(BorrowedBookService.class);

    private final BorrowedBookRepository borrowedBookRepository;

    public BorrowedBookService(BorrowedBookRepository borrowedBookRepository) {
        this.borrowedBookRepository = borrowedBookRepository;
    }

    /**
     * Save a borrowedBook.
     *
     * @param borrowedBook the entity to save.
     * @return the persisted entity.
     */
    public BorrowedBook save(BorrowedBook borrowedBook) {
        log.debug("Request to save BorrowedBook : {}", borrowedBook);
        return borrowedBookRepository.save(borrowedBook);
    }

    /**
     * Partially update a borrowedBook.
     *
     * @param borrowedBook the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<BorrowedBook> partialUpdate(BorrowedBook borrowedBook) {
        log.debug("Request to partially update BorrowedBook : {}", borrowedBook);

        return borrowedBookRepository
            .findById(borrowedBook.getId())
            .map(existingBorrowedBook -> {
                if (borrowedBook.getBorrowDate() != null) {
                    existingBorrowedBook.setBorrowDate(borrowedBook.getBorrowDate());
                }
                if (borrowedBook.getReturnDate() != null) {
                    existingBorrowedBook.setReturnDate(borrowedBook.getReturnDate());
                }
                if (borrowedBook.getStatus() != null) {
                    existingBorrowedBook.setStatus(borrowedBook.getStatus());
                }

                return existingBorrowedBook;
            })
            .map(borrowedBookRepository::save);
    }

    /**
     * Get all the borrowedBooks.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<BorrowedBook> findAll(Pageable pageable) {
        log.debug("Request to get all BorrowedBooks");
        return borrowedBookRepository.findAll(pageable);
    }

    /**
     * Get one borrowedBook by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<BorrowedBook> findOne(Long id) {
        log.debug("Request to get BorrowedBook : {}", id);
        return borrowedBookRepository.findById(id);
    }

    /**
     * Delete the borrowedBook by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete BorrowedBook : {}", id);
        borrowedBookRepository.deleteById(id);
    }
}
