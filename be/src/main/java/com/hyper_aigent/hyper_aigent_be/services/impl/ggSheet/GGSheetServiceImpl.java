package com.hyper_aigent.hyper_aigent_be.services.impl.ggSheet;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hyper_aigent.hyper_aigent_be.domain.dtos.external.FetchGGSheetRequest;
import com.hyper_aigent.hyper_aigent_be.domain.dtos.external.FetchGGSheetResponse;
import com.hyper_aigent.hyper_aigent_be.domain.dtos.ggSheet.FetchByUrlResponse;
import com.hyper_aigent.hyper_aigent_be.domain.entities.ChatEntity;
import com.hyper_aigent.hyper_aigent_be.domain.entities.GGSheetEntity;
import com.hyper_aigent.hyper_aigent_be.domain.entities.UserEntity;
import com.hyper_aigent.hyper_aigent_be.repositories.GGSheetRepository;
import com.hyper_aigent.hyper_aigent_be.services.externalServices.spread_sheet.SpreadSheetService;
import com.hyper_aigent.hyper_aigent_be.services.interfaces.chat.ChatService;
import com.hyper_aigent.hyper_aigent_be.services.interfaces.ggSheet.GGSheetService;
import com.hyper_aigent.hyper_aigent_be.services.interfaces.user.UserService;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class GGSheetServiceImpl implements GGSheetService {
    final private SpreadSheetService spreadSheetService;
    final private UserService userService;
    final private ChatService chatService;

    final private GGSheetRepository ggSheetRepository;

    public GGSheetServiceImpl(SpreadSheetService spreadSheetService,
                              GGSheetRepository ggSheetRepository,
                              UserService userService,
                              ChatService chatService) {
        this.spreadSheetService = spreadSheetService;
        this.ggSheetRepository = ggSheetRepository;
        this.userService = userService;
        this.chatService = chatService;
    }


    @Override
    public FetchByUrlResponse fetchByUrl(String url, Long userId) {
        FetchByUrlResponse response = new FetchByUrlResponse();

        // Check user
        Optional<UserEntity> user = userService.findById(userId);
        if (user.isEmpty()) {
            response.setMessage("Error: User not found!");
            return response;
        }

        // Create new chat entity
        ChatEntity newChat = ChatEntity.builder()
                .user(user.get())
                .topic("This is a default topic")
                .build();
        ChatEntity createdChat = chatService.create(newChat);

        // send url to spreadsheet service for preprocessing
        FetchGGSheetRequest requestObj = FetchGGSheetRequest.builder()
                .url(url)
                .chatId(createdChat.getId())
                .build();

        FetchGGSheetResponse resExternal = spreadSheetService.fetchGGSheet(requestObj);
        // fetched file will be saved to the database and send back, so that we can query it from here

        Long ggSheetSavedId = resExternal.getSavedId();
        response.setId(ggSheetSavedId);
        response.setName(resExternal.getName());
        response.setType(resExternal.getType());
        response.setMessage("Success");

        return response;
    }

    @Override
    public Optional<GGSheetEntity> findOneById(Long id) {
        return ggSheetRepository.findById(id);
    }

    @Override
    @Transactional
    public Optional<GGSheetEntity> findOneByChatId(Long chatId) {
        return ggSheetRepository.findByChatId(chatId);
    }

    public List<Object[]> findAllByUserId(Long userId) {
        return ggSheetRepository.findAllByUserId(userId);
    }

    @Override
    public Map<String, Object> getAllGGSheetInfo(Long userId) {
        Map<String, Object> result = new HashMap<>();

        Optional<UserEntity> user = userService.findById(userId);

        if (user.isEmpty()) {
            result.put("message", "Error: User not found!");
            return result;
        }

        List<Object[]> ggSheetList = findAllByUserId(userId);

        List<Map<String, Object>> mappedGGSheetList = new ArrayList<>();

        for (Object[] ggSheet : ggSheetList) {
            Map<String, Object> ggSheetMap = new HashMap<>();

            ggSheetMap.put("id", ggSheet[0]);
            ggSheetMap.put("name", ggSheet[1]);
            ggSheetMap.put("chatID", ggSheet[2]);

            mappedGGSheetList.add(ggSheetMap);
        }

        result.put("message", "Success");
        result.put("content", mappedGGSheetList);

        return result;
    }

    @Override
    @Transactional
    public Map<String, Object> getGGSheet(Long userId, Long ggSheetId) {
        Map<String, Object> result = new HashMap<>();

        Optional<UserEntity> user = userService.findById(userId);
        if (user.isEmpty()) {
            result.put("message", "Error: User not found!");
            return result;
        }

        Optional<GGSheetEntity> ggSheet = findOneById(ggSheetId);
        if (ggSheet.isEmpty()) {
            result.put("message", "Error: Google sheet not found!");
            return result;
        }

        GGSheetEntity foundGGSheet = ggSheet.get();
        String name = foundGGSheet.getName();
        result.put("fileName", name);
        byte[] content = foundGGSheet.getContent();
        result.put("content", content);
        Long chatId = foundGGSheet.getChat().getId();
        result.put("chatId", chatId);

        String contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

        //Set headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(contentType));
        headers.setContentDispositionFormData("attachment", name);
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
        result.put("headers", headers);

        result.put("message", "Success");
        return result;
    }


    @Override
    public Map<String, Object> getColumnDescriptions(Long id) throws JsonProcessingException {
        Optional<GGSheetEntity> ggSheetFile = findOneById(id);

        Map<String, Object> result = new HashMap<>();

        if (ggSheetFile.isEmpty()) {
            result.put("message", "Error: GGSheet file not found!");
            return result;
        }

        String columnDescriptionsStr = ggSheetFile.get().getColumnDescriptions();

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, String> columnDescriptionsMap = objectMapper.readValue(columnDescriptionsStr, Map.class);

        result.put("message", "Success");
        result.put("content", columnDescriptionsMap);
        return result;
    }

    @Override
    @Transactional
    public Boolean updateColumnDescription(Long id, String columnDescriptions) {
        Optional<GGSheetEntity> file = findOneById(id);

        if (file.isEmpty()) {
            return false;
        }

        ggSheetRepository.updateColumnDescriptionsById(id, columnDescriptions);
        return true;
    }
}
