package com.hyper_aigent.hyper_aigent_be.repositories;

import com.hyper_aigent.hyper_aigent_be.domain.entities.upload.FileEntity;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface FileRepository extends CrudRepository<FileEntity, Long> {
    Optional<FileEntity> findByChatId(Long chatId);

    @Query("""
                SELECT
                    files.id,
                    files.name,
                    chat.id
                FROM FileEntity files
                JOIN files.chat chat
                WHERE chat.user.id = :userId
                ORDER BY files.updatedAt DESC
            """)
    List<Object[]> findAllByUserId(Long userId);

    @Modifying
    @Query("UPDATE FileEntity f SET f.columnDescriptions = :columnDescriptions WHERE f.id = :id")
    void updateColumnDescriptionsById(Long id, String columnDescriptions);
}
