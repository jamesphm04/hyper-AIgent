package com.hyper_aigent.hyper_aigent_be.repositories;

import com.hyper_aigent.hyper_aigent_be.domain.dtos.chat.message.MessageDto;
import com.hyper_aigent.hyper_aigent_be.domain.dtos.chat.message.MessageWithoutImageDto;
import com.hyper_aigent.hyper_aigent_be.domain.entities.MessageEntity;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends CrudRepository<MessageEntity, Long> {

    @Query("SELECT new com.hyper_aigent.hyper_aigent_be.domain.dtos.chat.message.MessageDto(m.role, m.content, i.image) " +
            "FROM MessageEntity m " +
            "JOIN m.messagePair mp " +
            "JOIN mp.chat c " +
            "LEFT JOIN ImageEntity i ON m.id = i.message.id " +
            "WHERE c.id = :chatId " +
            "ORDER BY m.updatedAt")
    List<MessageDto> findMessagesByChatId(@Param("chatId") Long chatId);

    @Query("SELECT new com.hyper_aigent.hyper_aigent_be.domain.dtos.chat.message.MessageWithoutImageDto(m.role, m.content, m.script) " +
            "FROM MessageEntity m " +
            "JOIN m.messagePair mp " +
            "JOIN mp.chat c " +
            "WHERE c.id = :chatId " +
            "ORDER BY m.updatedAt DESC " +
            "LIMIT 2"
    )
    List<MessageWithoutImageDto> findMessagesByChatIdWithoutImages(@Param("chatId") Long chatId);
}