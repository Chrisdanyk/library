package cd.library.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import cd.library.IntegrationTest;
import cd.library.domain.BorrowedBook;
import cd.library.domain.enumeration.Status;
import cd.library.repository.BorrowedBookRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link BorrowedBookResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class BorrowedBookResourceIT {

    private static final LocalDate DEFAULT_BORROW_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_BORROW_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_RETURN_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_RETURN_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final Status DEFAULT_STATUS = Status.BORROWED;
    private static final Status UPDATED_STATUS = Status.RETURNED;

    private static final String ENTITY_API_URL = "/api/borrowed-books";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private BorrowedBookRepository borrowedBookRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBorrowedBookMockMvc;

    private BorrowedBook borrowedBook;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BorrowedBook createEntity(EntityManager em) {
        BorrowedBook borrowedBook = new BorrowedBook()
            .borrowDate(DEFAULT_BORROW_DATE)
            .returnDate(DEFAULT_RETURN_DATE)
            .status(DEFAULT_STATUS);
        return borrowedBook;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BorrowedBook createUpdatedEntity(EntityManager em) {
        BorrowedBook borrowedBook = new BorrowedBook()
            .borrowDate(UPDATED_BORROW_DATE)
            .returnDate(UPDATED_RETURN_DATE)
            .status(UPDATED_STATUS);
        return borrowedBook;
    }

    @BeforeEach
    public void initTest() {
        borrowedBook = createEntity(em);
    }

    @Test
    @Transactional
    void createBorrowedBook() throws Exception {
        int databaseSizeBeforeCreate = borrowedBookRepository.findAll().size();
        // Create the BorrowedBook
        restBorrowedBookMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(borrowedBook)))
            .andExpect(status().isCreated());

        // Validate the BorrowedBook in the database
        List<BorrowedBook> borrowedBookList = borrowedBookRepository.findAll();
        assertThat(borrowedBookList).hasSize(databaseSizeBeforeCreate + 1);
        BorrowedBook testBorrowedBook = borrowedBookList.get(borrowedBookList.size() - 1);
        assertThat(testBorrowedBook.getBorrowDate()).isEqualTo(DEFAULT_BORROW_DATE);
        assertThat(testBorrowedBook.getReturnDate()).isEqualTo(DEFAULT_RETURN_DATE);
        assertThat(testBorrowedBook.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    @Transactional
    void createBorrowedBookWithExistingId() throws Exception {
        // Create the BorrowedBook with an existing ID
        borrowedBook.setId(1L);

        int databaseSizeBeforeCreate = borrowedBookRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBorrowedBookMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(borrowedBook)))
            .andExpect(status().isBadRequest());

        // Validate the BorrowedBook in the database
        List<BorrowedBook> borrowedBookList = borrowedBookRepository.findAll();
        assertThat(borrowedBookList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkStatusIsRequired() throws Exception {
        int databaseSizeBeforeTest = borrowedBookRepository.findAll().size();
        // set the field null
        borrowedBook.setStatus(null);

        // Create the BorrowedBook, which fails.

        restBorrowedBookMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(borrowedBook)))
            .andExpect(status().isBadRequest());

        List<BorrowedBook> borrowedBookList = borrowedBookRepository.findAll();
        assertThat(borrowedBookList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllBorrowedBooks() throws Exception {
        // Initialize the database
        borrowedBookRepository.saveAndFlush(borrowedBook);

        // Get all the borrowedBookList
        restBorrowedBookMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(borrowedBook.getId().intValue())))
            .andExpect(jsonPath("$.[*].borrowDate").value(hasItem(DEFAULT_BORROW_DATE.toString())))
            .andExpect(jsonPath("$.[*].returnDate").value(hasItem(DEFAULT_RETURN_DATE.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())));
    }

    @Test
    @Transactional
    void getBorrowedBook() throws Exception {
        // Initialize the database
        borrowedBookRepository.saveAndFlush(borrowedBook);

        // Get the borrowedBook
        restBorrowedBookMockMvc
            .perform(get(ENTITY_API_URL_ID, borrowedBook.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(borrowedBook.getId().intValue()))
            .andExpect(jsonPath("$.borrowDate").value(DEFAULT_BORROW_DATE.toString()))
            .andExpect(jsonPath("$.returnDate").value(DEFAULT_RETURN_DATE.toString()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()));
    }

    @Test
    @Transactional
    void getNonExistingBorrowedBook() throws Exception {
        // Get the borrowedBook
        restBorrowedBookMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewBorrowedBook() throws Exception {
        // Initialize the database
        borrowedBookRepository.saveAndFlush(borrowedBook);

        int databaseSizeBeforeUpdate = borrowedBookRepository.findAll().size();

        // Update the borrowedBook
        BorrowedBook updatedBorrowedBook = borrowedBookRepository.findById(borrowedBook.getId()).get();
        // Disconnect from session so that the updates on updatedBorrowedBook are not directly saved in db
        em.detach(updatedBorrowedBook);
        updatedBorrowedBook.borrowDate(UPDATED_BORROW_DATE).returnDate(UPDATED_RETURN_DATE).status(UPDATED_STATUS);

        restBorrowedBookMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBorrowedBook.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedBorrowedBook))
            )
            .andExpect(status().isOk());

        // Validate the BorrowedBook in the database
        List<BorrowedBook> borrowedBookList = borrowedBookRepository.findAll();
        assertThat(borrowedBookList).hasSize(databaseSizeBeforeUpdate);
        BorrowedBook testBorrowedBook = borrowedBookList.get(borrowedBookList.size() - 1);
        assertThat(testBorrowedBook.getBorrowDate()).isEqualTo(UPDATED_BORROW_DATE);
        assertThat(testBorrowedBook.getReturnDate()).isEqualTo(UPDATED_RETURN_DATE);
        assertThat(testBorrowedBook.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void putNonExistingBorrowedBook() throws Exception {
        int databaseSizeBeforeUpdate = borrowedBookRepository.findAll().size();
        borrowedBook.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBorrowedBookMockMvc
            .perform(
                put(ENTITY_API_URL_ID, borrowedBook.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(borrowedBook))
            )
            .andExpect(status().isBadRequest());

        // Validate the BorrowedBook in the database
        List<BorrowedBook> borrowedBookList = borrowedBookRepository.findAll();
        assertThat(borrowedBookList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBorrowedBook() throws Exception {
        int databaseSizeBeforeUpdate = borrowedBookRepository.findAll().size();
        borrowedBook.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBorrowedBookMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(borrowedBook))
            )
            .andExpect(status().isBadRequest());

        // Validate the BorrowedBook in the database
        List<BorrowedBook> borrowedBookList = borrowedBookRepository.findAll();
        assertThat(borrowedBookList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBorrowedBook() throws Exception {
        int databaseSizeBeforeUpdate = borrowedBookRepository.findAll().size();
        borrowedBook.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBorrowedBookMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(borrowedBook)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the BorrowedBook in the database
        List<BorrowedBook> borrowedBookList = borrowedBookRepository.findAll();
        assertThat(borrowedBookList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBorrowedBookWithPatch() throws Exception {
        // Initialize the database
        borrowedBookRepository.saveAndFlush(borrowedBook);

        int databaseSizeBeforeUpdate = borrowedBookRepository.findAll().size();

        // Update the borrowedBook using partial update
        BorrowedBook partialUpdatedBorrowedBook = new BorrowedBook();
        partialUpdatedBorrowedBook.setId(borrowedBook.getId());

        partialUpdatedBorrowedBook.returnDate(UPDATED_RETURN_DATE);

        restBorrowedBookMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBorrowedBook.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBorrowedBook))
            )
            .andExpect(status().isOk());

        // Validate the BorrowedBook in the database
        List<BorrowedBook> borrowedBookList = borrowedBookRepository.findAll();
        assertThat(borrowedBookList).hasSize(databaseSizeBeforeUpdate);
        BorrowedBook testBorrowedBook = borrowedBookList.get(borrowedBookList.size() - 1);
        assertThat(testBorrowedBook.getBorrowDate()).isEqualTo(DEFAULT_BORROW_DATE);
        assertThat(testBorrowedBook.getReturnDate()).isEqualTo(UPDATED_RETURN_DATE);
        assertThat(testBorrowedBook.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    @Transactional
    void fullUpdateBorrowedBookWithPatch() throws Exception {
        // Initialize the database
        borrowedBookRepository.saveAndFlush(borrowedBook);

        int databaseSizeBeforeUpdate = borrowedBookRepository.findAll().size();

        // Update the borrowedBook using partial update
        BorrowedBook partialUpdatedBorrowedBook = new BorrowedBook();
        partialUpdatedBorrowedBook.setId(borrowedBook.getId());

        partialUpdatedBorrowedBook.borrowDate(UPDATED_BORROW_DATE).returnDate(UPDATED_RETURN_DATE).status(UPDATED_STATUS);

        restBorrowedBookMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBorrowedBook.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBorrowedBook))
            )
            .andExpect(status().isOk());

        // Validate the BorrowedBook in the database
        List<BorrowedBook> borrowedBookList = borrowedBookRepository.findAll();
        assertThat(borrowedBookList).hasSize(databaseSizeBeforeUpdate);
        BorrowedBook testBorrowedBook = borrowedBookList.get(borrowedBookList.size() - 1);
        assertThat(testBorrowedBook.getBorrowDate()).isEqualTo(UPDATED_BORROW_DATE);
        assertThat(testBorrowedBook.getReturnDate()).isEqualTo(UPDATED_RETURN_DATE);
        assertThat(testBorrowedBook.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void patchNonExistingBorrowedBook() throws Exception {
        int databaseSizeBeforeUpdate = borrowedBookRepository.findAll().size();
        borrowedBook.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBorrowedBookMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, borrowedBook.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(borrowedBook))
            )
            .andExpect(status().isBadRequest());

        // Validate the BorrowedBook in the database
        List<BorrowedBook> borrowedBookList = borrowedBookRepository.findAll();
        assertThat(borrowedBookList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBorrowedBook() throws Exception {
        int databaseSizeBeforeUpdate = borrowedBookRepository.findAll().size();
        borrowedBook.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBorrowedBookMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(borrowedBook))
            )
            .andExpect(status().isBadRequest());

        // Validate the BorrowedBook in the database
        List<BorrowedBook> borrowedBookList = borrowedBookRepository.findAll();
        assertThat(borrowedBookList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBorrowedBook() throws Exception {
        int databaseSizeBeforeUpdate = borrowedBookRepository.findAll().size();
        borrowedBook.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBorrowedBookMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(borrowedBook))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the BorrowedBook in the database
        List<BorrowedBook> borrowedBookList = borrowedBookRepository.findAll();
        assertThat(borrowedBookList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBorrowedBook() throws Exception {
        // Initialize the database
        borrowedBookRepository.saveAndFlush(borrowedBook);

        int databaseSizeBeforeDelete = borrowedBookRepository.findAll().size();

        // Delete the borrowedBook
        restBorrowedBookMockMvc
            .perform(delete(ENTITY_API_URL_ID, borrowedBook.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<BorrowedBook> borrowedBookList = borrowedBookRepository.findAll();
        assertThat(borrowedBookList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
