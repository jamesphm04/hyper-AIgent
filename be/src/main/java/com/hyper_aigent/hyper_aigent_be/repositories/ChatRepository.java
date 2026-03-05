package com.hyper_aigent.hyper_aigent_be.repositories;

import com.hyper_aigent.hyper_aigent_be.domain.entities.ChatEntity;
import com.hyper_aigent.hyper_aigent_be.domain.entities.UserEntity;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ChatRepository extends CrudRepository<ChatEntity, Long> {
    List<ChatEntity> findByUser(UserEntity userEntity);

    @Modifying
    @Transactional
    @Query("DELETE FROM ChatEntity c WHERE c.id = :chatId")
    void deleteById(Long chatId);
}