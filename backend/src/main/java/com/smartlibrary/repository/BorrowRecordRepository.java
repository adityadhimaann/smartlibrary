package com.smartlibrary.repository;

import com.smartlibrary.model.BorrowRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BorrowRecordRepository extends JpaRepository<BorrowRecord, Long> {
    
    List<BorrowRecord> findByUserIdAndStatus(Long userId, BorrowRecord.Status status);
    
    List<BorrowRecord> findByBookIdAndStatus(Long bookId, BorrowRecord.Status status);
    
    List<BorrowRecord> findByUserIdOrderByBorrowDateDesc(Long userId);
    
    @Query("SELECT br FROM BorrowRecord br WHERE br.dueDate < :currentDate AND br.status = 'BORROWED'")
    List<BorrowRecord> findOverdueRecords(@Param("currentDate") LocalDate currentDate);
    
    @Query("SELECT br FROM BorrowRecord br WHERE br.user.id = :userId AND br.book.id = :bookId AND br.status = 'BORROWED'")
    List<BorrowRecord> findActiveBorrowRecord(@Param("userId") Long userId, @Param("bookId") Long bookId);
    
    @Query("SELECT COUNT(br) FROM BorrowRecord br WHERE br.user.id = :userId AND br.status = 'BORROWED'")
    Long countActiveBorrowsByUser(@Param("userId") Long userId);
    
    @Query("SELECT DISTINCT br.book.category FROM BorrowRecord br WHERE br.user.id = :userId")
    List<String> findUserPreferredCategories(@Param("userId") Long userId);
}
