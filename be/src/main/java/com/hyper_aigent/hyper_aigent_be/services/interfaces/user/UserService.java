package com.hyper_aigent.hyper_aigent_be.services.interfaces.user;

import com.hyper_aigent.hyper_aigent_be.domain.dtos.user.LoginResponseDto;
import com.hyper_aigent.hyper_aigent_be.domain.dtos.user.UserDto;
import com.hyper_aigent.hyper_aigent_be.domain.entities.UserEntity;
import com.hyper_aigent.hyper_aigent_be.exceptions.UserAlreadyExistsException;

import java.util.Optional;

public interface UserService {
    LoginResponseDto signup(UserDto userDto) throws UserAlreadyExistsException;

    LoginResponseDto login(UserDto userDto);

    UserEntity partialUpdate(Long id, UserEntity authorEntity);

    Optional<UserEntity> findById(Long id);

    Optional<UserEntity> findByEmail(String email);

    boolean isExist(Long id);

    void delete(Long id);
}

