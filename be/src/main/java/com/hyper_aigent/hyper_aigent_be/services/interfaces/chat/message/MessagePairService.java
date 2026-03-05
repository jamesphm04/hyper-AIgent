package com.hyper_aigent.hyper_aigent_be.services.interfaces.chat.message;

import com.hyper_aigent.hyper_aigent_be.domain.dtos.chat.message.MessageDto;
import com.hyper_aigent.hyper_aigent_be.domain.entities.ChatEntity;
import com.hyper_aigent.hyper_aigent_be.domain.entities.MessagePairEntity;

import java.util.List;

public interface MessagePairService {
    MessagePairEntity create(MessagePairEntity newMessagePairEntity);

    List<MessageDto> findAll(ChatEntity chatEntity);
}
