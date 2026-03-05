package com.hyper_aigent.hyper_aigent_be.services.impl.chat.message;

import com.hyper_aigent.hyper_aigent_be.domain.dtos.chat.message.MessageDto;
import com.hyper_aigent.hyper_aigent_be.domain.entities.ChatEntity;
import com.hyper_aigent.hyper_aigent_be.domain.entities.MessagePairEntity;
import com.hyper_aigent.hyper_aigent_be.repositories.MessagePairRepository;
import com.hyper_aigent.hyper_aigent_be.services.interfaces.chat.message.MessagePairService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class MessagePairServiceImpl implements MessagePairService {
    final private MessagePairRepository messagePairRepository;

    public MessagePairServiceImpl(MessagePairRepository messagePairRepository) {
        this.messagePairRepository = messagePairRepository;
    }

    @Override
    public MessagePairEntity create(MessagePairEntity newMessagePairEntity) {
        return messagePairRepository.save(newMessagePairEntity);
    }

    @Override
    public List<MessageDto> findAll(ChatEntity chatEntity) {
        //connect two table -> get List<MessagePairEntity>
        List<MessagePairEntity> history = messagePairRepository.findByChat(chatEntity);

        List<MessageDto> messages = new ArrayList<>();

//        for(MessagePairEntity in )


        return new ArrayList<MessageDto>();
    }
}