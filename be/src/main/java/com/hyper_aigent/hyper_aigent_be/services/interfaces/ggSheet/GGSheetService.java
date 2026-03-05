package com.hyper_aigent.hyper_aigent_be.services.interfaces.ggSheet;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.hyper_aigent.hyper_aigent_be.domain.dtos.ggSheet.FetchByUrlResponse;
import com.hyper_aigent.hyper_aigent_be.domain.entities.GGSheetEntity;

import java.util.Map;
import java.util.Optional;

public interface GGSheetService {
    FetchByUrlResponse fetchByUrl(String url, Long userId);

    Optional<GGSheetEntity> findOneById(Long id);

    Optional<GGSheetEntity> findOneByChatId(Long chatId);

    Map<String, Object> getAllGGSheetInfo(Long userId);

    Map<String, Object> getGGSheet(Long userId, Long ggSheetId);

    Map<String, Object> getColumnDescriptions(Long id) throws JsonProcessingException;

    Boolean updateColumnDescription(Long id, String columnDescriptions);
}
