package com.hyper_aigent.hyper_aigent_be.repositories;

import com.hyper_aigent.hyper_aigent_be.domain.entities.ChatEntity;
import com.hyper_aigent.hyper_aigent_be.domain.entities.MessagePairEntity;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface MessagePairRepository extends CrudRepository<MessagePairEntity, Long> {
    List<MessagePairEntity> findByChat(ChatEntity chatEntity);
}
