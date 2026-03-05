package com.hyper_aigent.hyper_aigent_be.services.interfaces.chat;

import com.hyper_aigent.hyper_aigent_be.domain.dtos.chat.message.MessageDto;
import com.hyper_aigent.hyper_aigent_be.domain.entities.ChatEntity;
import com.hyper_aigent.hyper_aigent_be.domain.entities.UserEntity;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface ChatService {
    ChatEntity create(ChatEntity chatEntity);

    List<ChatEntity> findAllByUser(UserEntity userEntity);

    void delete(Long id);

    Optional<ChatEntity> findById(Long chatId);

    Map<String, Object> getAnswer(ChatEntity chat, String question, String source);

    List<MessageDto> getHistory(Long chatId);
}
