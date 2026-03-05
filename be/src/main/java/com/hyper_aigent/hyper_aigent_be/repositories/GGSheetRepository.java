package com.hyper_aigent.hyper_aigent_be.repositories;

import com.hyper_aigent.hyper_aigent_be.domain.entities.GGSheetEntity;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface GGSheetRepository extends CrudRepository<GGSheetEntity, Long> {
    Optional<GGSheetEntity> findByChatId(Long chatId);

    @Query("""
                SELECT
                    gg_sheets.id,
                    gg_sheets.name,
                    chat.id
                FROM GGSheetEntity gg_sheets
                JOIN gg_sheets.chat chat
                WHERE chat.user.id = :userId
                ORDER BY gg_sheets.updatedAt DESC
            """)
    List<Object[]> findAllByUserId(Long userId);

    @Modifying
    @Query("UPDATE GGSheetEntity g SET g.columnDescriptions = :columnDescriptions WHERE g.id = :id")
    void updateColumnDescriptionsById(Long id, String columnDescriptions);
}
