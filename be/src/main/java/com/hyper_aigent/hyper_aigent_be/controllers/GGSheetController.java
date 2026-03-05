package com.hyper_aigent.hyper_aigent_be.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.hyper_aigent.hyper_aigent_be.domain.dtos.ggSheet.FetchByUrlResponse;
import com.hyper_aigent.hyper_aigent_be.domain.dtos.ggSheet.FetchGGSheetByUrlReqDto;
import com.hyper_aigent.hyper_aigent_be.domain.dtos.ggSheet.FetchGGSheetByUrlResDto;
import com.hyper_aigent.hyper_aigent_be.domain.dtos.upload.GetFileResponse;
import com.hyper_aigent.hyper_aigent_be.services.interfaces.chat.ChatService;
import com.hyper_aigent.hyper_aigent_be.services.interfaces.ggSheet.GGSheetService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@RestController
public class GGSheetController {
    final private GGSheetService ggSheetService;
    final private ChatService chatService;

    public GGSheetController(GGSheetService ggSheetService,
                             ChatService chatService) {
        this.ggSheetService = ggSheetService;
        this.chatService = chatService;
    }

    @PostMapping(path = "/api/v2/users/{userId}/gg-sheets/fetch")
    public ResponseEntity<FetchGGSheetByUrlResDto> fetchGGSheetByUrl(@PathVariable("userId") Long userId,
                                                                     @RequestBody FetchGGSheetByUrlReqDto reqBody) throws IOException {
        FetchGGSheetByUrlResDto response = new FetchGGSheetByUrlResDto();
        FetchByUrlResponse resService = ggSheetService.fetchByUrl(reqBody.getUrl(), userId);

        String message = resService.getMessage();
        if (message.startsWith("Error")) {
            response.setMessage(message);
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }

        response.setGgSheetFileId(resService.getId());
        response.setGgSheetFileName(resService.getName());
        response.setMessage(message);

        return ResponseEntity.ok(response);
    }

    @GetMapping(path = "/api/v2/users/{userId}/gg-sheets/all-gg-sheets")
    public ResponseEntity<?> getAllGGSheetInfo(@PathVariable("userId") Long userId) {
        Map<String, Object> result = ggSheetService.getAllGGSheetInfo(userId);
        String message = (String) result.get("message");

        if (message.startsWith("Error")) {
            return new ResponseEntity<>(message, HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(result.get("content"), HttpStatus.OK);
    }

    @GetMapping(path = "/api/v2/users/{userId}/gg-sheets/{ggSheetFileId}")
    public ResponseEntity<?> getLinkedGGSheet(@PathVariable("userId") Long userId,
                                              @PathVariable("ggSheetFileId") Long ggSheetFileId) {
        Map<String, Object> result = ggSheetService.getGGSheet(userId, ggSheetFileId);
        String message = (String) result.get("message");
        if (message.startsWith("Error")) {
            return new ResponseEntity<>(message, HttpStatus.NOT_FOUND);
        }

        HttpHeaders headers = (HttpHeaders) result.get("headers");
        byte[] fileContent = (byte[]) result.get("content");
        Long chatId = (Long) result.get("chatId");
        String fileName = (String) result.get("fileName");

        GetFileResponse response = GetFileResponse.builder()
                .fileContent(fileContent)
                .fileName(fileName)
                .headers(headers)
                .chatId(chatId)
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping(path = "/api/v2/gg-sheets/{chatID}")
    public ResponseEntity<?> deleteFileByChatID(@PathVariable("chatID") Long chatID) {
        chatService.delete(chatID);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping(path = "/api/v2/gg-sheets/{ggSheetID}/column-description")
    public ResponseEntity<?> getColumnDescription(@PathVariable("ggSheetID") Long ggSheetID) throws JsonProcessingException {
        Map<String, Object> result = ggSheetService.getColumnDescriptions(ggSheetID);

        String message = (String) result.get("message");
        if (message.startsWith("Error")) {
            return new ResponseEntity<>(message, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(result.get("content"), HttpStatus.OK);
    }

    @PutMapping(path = "/api/v2/gg-sheets/{ggSheetID}/column-description")
    public ResponseEntity<?> updateColumnDescription(@PathVariable("ggSheetID") Long ggSheetID,
                                                     @RequestBody String columnDescriptions) {
        Boolean isSuccessful = ggSheetService.updateColumnDescription(ggSheetID, columnDescriptions);

        if (isSuccessful) {
            System.out.println("Success: Column descriptions updated!");
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            System.out.println("Error: File not found!");
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

}
