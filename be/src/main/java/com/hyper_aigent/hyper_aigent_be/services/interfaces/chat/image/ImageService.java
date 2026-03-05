package com.hyper_aigent.hyper_aigent_be.services.interfaces.chat.image;

import com.hyper_aigent.hyper_aigent_be.domain.entities.ImageEntity;

import java.util.Optional;

public interface ImageService {
    ImageEntity create(ImageEntity imageEntity);

    Optional<ImageEntity> findByQAPairId(long qaPairId, String role);
}
