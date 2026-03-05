package com.hyper_aigent.hyper_aigent_be.mappers.impl;

import com.hyper_aigent.hyper_aigent_be.domain.dtos.chat.message.MessageDto;
import com.hyper_aigent.hyper_aigent_be.domain.entities.MessageEntity;
import com.hyper_aigent.hyper_aigent_be.mappers.Mapper;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class MessageMapper implements Mapper<MessageEntity, MessageDto> {

    final private ModelMapper modelMapper;

    public MessageMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    @Override
    public MessageDto mapTo(MessageEntity messageEntity) {
        return modelMapper.map(messageEntity, MessageDto.class);
    }

    @Override
    public MessageEntity mapFrom(MessageDto messageDto) {
        return modelMapper.map(messageDto, MessageEntity.class);
    }
}
