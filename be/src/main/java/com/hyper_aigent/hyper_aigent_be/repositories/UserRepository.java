package com.hyper_aigent.hyper_aigent_be.repositories;

import com.hyper_aigent.hyper_aigent_be.domain.entities.UserEntity;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface UserRepository extends CrudRepository<UserEntity, Long> {
    Optional<UserEntity> findByEmail(String email);
}
