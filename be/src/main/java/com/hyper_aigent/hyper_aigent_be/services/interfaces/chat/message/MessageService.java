package com.hyper_aigent.hyper_aigent_be.services.interfaces.chat.message;

import com.hyper_aigent.hyper_aigent_be.domain.dtos.chat.message.MessageDto;
import com.hyper_aigent.hyper_aigent_be.domain.dtos.chat.message.MessageWithoutImageDto;
import com.hyper_aigent.hyper_aigent_be.domain.entities.MessageEntity;

import java.util.List;

public interface MessageService {

    MessageEntity create(MessageEntity newMessageEntity);

    List<MessageDto> getHistory(Long chatId);

    List<MessageWithoutImageDto> getHistoryWithoutImages(Long chatId);
}
