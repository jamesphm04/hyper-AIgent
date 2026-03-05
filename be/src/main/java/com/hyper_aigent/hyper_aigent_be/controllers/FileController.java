package com.hyper_aigent.hyper_aigent_be.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.hyper_aigent.hyper_aigent_be.domain.dtos.upload.GetFileResponse;
import com.hyper_aigent.hyper_aigent_be.domain.dtos.upload.UploadFileResponse;
import com.hyper_aigent.hyper_aigent_be.services.interfaces.chat.ChatService;
import com.hyper_aigent.hyper_aigent_be.services.interfaces.file.FileService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
public class FileController {
    final private FileService fileService;
    final private ChatService chatService;

    public FileController(FileService fileService,
                          ChatService chatService) {
        this.fileService = fileService;
        this.chatService = chatService;
    }

    @PostMapping(path = "/api/v2/users/{userId}/files/upload")
    public ResponseEntity<UploadFileResponse> uploadFile(@PathVariable("userId") Long userId,
                                                         @RequestParam(value = "file") MultipartFile file) throws IOException {
        UploadFileResponse response = fileService.uploadFile(userId, file);

        if (response.getMessage().startsWith("Error")) {
            System.out.println(response.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
        System.out.println("Success: File uploaded!");
        return ResponseEntity.ok(response);
    }

    @PutMapping(path = "/api/v2/files/{fileId}/column-description")
    public ResponseEntity<?> updateColumnDescription(@PathVariable("fileId") Long fileId,
                                                     @RequestBody String columnDescriptions) {
        Boolean isSuccessful = fileService.updateColumnDescription(fileId, columnDescriptions);

        if (isSuccessful) {
            System.out.println("Success: Column descriptions updated!");
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            System.out.println("Error: File not found!");
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping(path = "/api/v2/files/{fileId}/column-description")
    public ResponseEntity<?> getColumnDescription(@PathVariable("fileId") Long fileId) throws JsonProcessingException {

        Map<String, Object> result = fileService.getColumnDescriptions(fileId);

        String message = (String) result.get("message");
        if (message.startsWith("Error")) {
            return new ResponseEntity<>(message, HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(result.get("content"), HttpStatus.OK);
    }

    @GetMapping(path = "/api/v2/users/{userId}/files/all-files")
    public ResponseEntity<?> getAllFileInfo(@PathVariable("userId") Long userId) {
        Map<String, Object> result = fileService.getAllFileInfo(userId);
        String message = (String) result.get("message");

        if (message.startsWith("Error")) {
            return new ResponseEntity<>(message, HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(result.get("content"), HttpStatus.OK);
    }

    @GetMapping(path = "/api/v2/files/{fileId}")
    public ResponseEntity<?> getFile(@PathVariable("fileId") Long fileId) {
        Map<String, Object> result = fileService.getFile(fileId);
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

    @DeleteMapping(path = "/api/v2/files/{chatID}")
    public ResponseEntity<?> deleteFileByChatID(@PathVariable("chatID") Long chatID) {
        chatService.delete(chatID);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
