package com.hyper_aigent.hyper_aigent_be.services.impl.chat.image;

import com.hyper_aigent.hyper_aigent_be.domain.entities.ImageEntity;
import com.hyper_aigent.hyper_aigent_be.repositories.ImageRepository;
import com.hyper_aigent.hyper_aigent_be.services.interfaces.chat.image.ImageService;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ImageServiceImpl implements ImageService {
    final private ImageRepository imageRepository;

    public ImageServiceImpl(ImageRepository imageRepository) {
        this.imageRepository = imageRepository;
    }

    @Override
    public ImageEntity create(ImageEntity imageEntity) {
        return imageRepository.save(imageEntity);
    }

    @Override
    public Optional<ImageEntity> findByQAPairId(long imageId, String role) {
        return imageRepository.findByQAPairId(imageId, role);
    }
}