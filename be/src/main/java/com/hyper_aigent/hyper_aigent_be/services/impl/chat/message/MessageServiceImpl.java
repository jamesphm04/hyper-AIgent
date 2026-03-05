package com.hyper_aigent.hyper_aigent_be.services.impl.chat.message;

import com.hyper_aigent.hyper_aigent_be.domain.dtos.chat.message.MessageDto;
import com.hyper_aigent.hyper_aigent_be.domain.dtos.chat.message.MessageWithoutImageDto;
import com.hyper_aigent.hyper_aigent_be.domain.entities.MessageEntity;
import com.hyper_aigent.hyper_aigent_be.repositories.MessageRepository;
import com.hyper_aigent.hyper_aigent_be.services.interfaces.chat.message.MessageService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageServiceImpl implements MessageService {
    final private MessageRepository messageRepository;

    public MessageServiceImpl(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    @Override
    public MessageEntity create(MessageEntity newMessageEntity) {
        return messageRepository.save(newMessageEntity);
    }

    @Override
    public List<MessageDto> getHistory(Long chatId) {
        return messageRepository.findMessagesByChatId(chatId);
    }

    @Override
    public List<MessageWithoutImageDto> getHistoryWithoutImages(Long chatId) {
        return messageRepository.findMessagesByChatIdWithoutImages(chatId);
    }
}