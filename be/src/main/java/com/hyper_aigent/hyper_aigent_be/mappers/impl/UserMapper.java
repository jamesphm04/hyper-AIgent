package com.hyper_aigent.hyper_aigent_be.mappers.impl;

import com.hyper_aigent.hyper_aigent_be.domain.dtos.user.UserDto;
import com.hyper_aigent.hyper_aigent_be.domain.entities.UserEntity;
import com.hyper_aigent.hyper_aigent_be.mappers.Mapper;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class UserMapper implements Mapper<UserEntity, UserDto> {

    final private ModelMapper modelMapper;

    public UserMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    @Override
    public UserDto mapTo(UserEntity userEntity) {
        return modelMapper.map(userEntity, UserDto.class);
    }

    @Override
    public UserEntity mapFrom(UserDto userDto) {
        return modelMapper.map(userDto, UserEntity.class);
    }
}
