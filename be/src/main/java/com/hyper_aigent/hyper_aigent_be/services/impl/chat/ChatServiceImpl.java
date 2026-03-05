package com.hyper_aigent.hyper_aigent_be.services.impl.chat;

import com.hyper_aigent.hyper_aigent_be.domain.dtos.chat.message.MessageDto;
import com.hyper_aigent.hyper_aigent_be.domain.dtos.chat.message.MessageWithoutImageDto;
import com.hyper_aigent.hyper_aigent_be.domain.dtos.external.HandleConversationRequest;
import com.hyper_aigent.hyper_aigent_be.domain.dtos.external.HandleConversationResponse;
import com.hyper_aigent.hyper_aigent_be.domain.entities.*;
import com.hyper_aigent.hyper_aigent_be.mappers.Mapper;
import com.hyper_aigent.hyper_aigent_be.repositories.ChatRepository;
import com.hyper_aigent.hyper_aigent_be.services.externalServices.spread_sheet.SpreadSheetService;
import com.hyper_aigent.hyper_aigent_be.services.interfaces.chat.ChatService;
import com.hyper_aigent.hyper_aigent_be.services.interfaces.chat.image.ImageService;
import com.hyper_aigent.hyper_aigent_be.services.interfaces.chat.message.MessagePairService;
import com.hyper_aigent.hyper_aigent_be.services.interfaces.chat.message.MessageService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class ChatServiceImpl implements ChatService {
    final private ChatRepository chatRepository;

    final private MessagePairService messagePairService;
    final private MessageService messageService;
    final private SpreadSheetService spreadSheetService;
    final private ImageService imageService;

    final private Mapper<MessageEntity, MessageDto> messageMapper;


    public ChatServiceImpl(ChatRepository chatRepository,
                           MessagePairService messagePairService,
                           MessageService messageService,
                           SpreadSheetService spreadSheetService,
                           ImageService imageService,
                           Mapper<MessageEntity, MessageDto> messageMapper) {
        this.chatRepository = chatRepository;
        this.messagePairService = messagePairService;
        this.messageService = messageService;

        this.spreadSheetService = spreadSheetService;
        this.imageService = imageService;

        this.messageMapper = messageMapper;
    }

    @Override
    public ChatEntity create(ChatEntity chatEntity) {
        return chatRepository.save(chatEntity);
    }

    @Override
    public List<ChatEntity> findAllByUser(UserEntity userEntity) {
        return chatRepository.findByUser(userEntity);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Optional<ChatEntity> optionalChatEntity = chatRepository.findById(id);

        if (optionalChatEntity.isEmpty()) {
            throw new RuntimeException("Chat not found with id: " + id);
        }

        chatRepository.deleteById(id);
    }

    @Override
    public Optional<ChatEntity> findById(Long chatId) {
        Optional<ChatEntity> optionalExistingChatEntity = chatRepository.findById(chatId);
        if (optionalExistingChatEntity.isPresent() && optionalExistingChatEntity.get().getDeletedAt() == null) {
            return optionalExistingChatEntity;
        } else {
            throw new RuntimeException("Chat not found or deleted with id: " + chatId);
        }
    }

    @Override
    public Map<String, Object> getAnswer(ChatEntity chat, String question, String source) {
        Map<String, Object> result = new HashMap<>();

        // saving message pair object
        MessagePairEntity messagePair = MessagePairEntity.builder()
                .chat(chat)
                .build();

        messagePairService.create(messagePair);

        // saving the query message first
        MessageEntity queryMessage = MessageEntity.builder()
                .messagePair(messagePair)
                .content(question)
                .role("user")
                .build();

        messageService.create(queryMessage);

        List<MessageWithoutImageDto> history = messageService.getHistoryWithoutImages(chat.getId());

        // get response from external service
        HandleConversationRequest requestBody = HandleConversationRequest.builder()
                .question(question)
                .chatId(chat.getId())
                .history(history)
                .source(source)
                .build();

        HandleConversationResponse serviceResponse = spreadSheetService.handleConversation(requestBody);

        if (serviceResponse.getAnswer().startsWith("Error")) {
            result.put("message", serviceResponse.getAnswer());
            return result;
        }

        MessageEntity resMessage = MessageEntity.builder()
                .messagePair(messagePair)
                .content(serviceResponse.getAnswer())
                .script(serviceResponse.getScript())
                .role("assistant")
                .build();

        messageService.create(resMessage);

        byte[] resImageBytes = null;

        // save response image
        if (serviceResponse.getImage() != null) {
            resImageBytes = Base64.getDecoder().decode(serviceResponse.getImage());

            ImageEntity resImageEntity = ImageEntity.builder()
                    .role("assistant")
                    .image(resImageBytes)
                    .message(resMessage)
                    .build();

            imageService.create(resImageEntity);
        }

        // build response
        MessageDto queryMessageDto = MessageDto.builder()
                .role("user")
                .content(question)
                .build();

        MessageDto resMessageDto = messageMapper.mapTo(resMessage);
        if (resImageBytes != null) {
            resMessageDto.setImage(resImageBytes);
        }

        List<MessageDto> response = new ArrayList<>();
        response.add(queryMessageDto);
        response.add(resMessageDto);

        result.put("message", "Success");
        result.put("content", response);

        return result;
    }

    @Override
    public List<MessageDto> getHistory(Long chatId) {
        return messageService.getHistory(chatId);
    }

}
