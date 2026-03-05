package com.hyper_aigent.hyper_aigent_be.services.interfaces.file;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.hyper_aigent.hyper_aigent_be.domain.dtos.upload.UploadFileResponse;
import com.hyper_aigent.hyper_aigent_be.domain.entities.upload.FileEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface FileService {
    FileEntity saveToDB(FileEntity fileEntity);

    Optional<FileEntity> findOneByChatId(Long chatId);

    Optional<FileEntity> findOneById(Long id);

    List<Object[]> findAllByUserId(Long userId);

    UploadFileResponse uploadFile(Long userId, MultipartFile file) throws IOException;

    Boolean updateColumnDescription(Long id, String columnDescriptions);

    Map<String, Object> getColumnDescriptions(Long id) throws JsonProcessingException;

    Map<String, Object> getAllFileInfo(Long userId);

    Map<String, Object> getFile(Long id);
}
