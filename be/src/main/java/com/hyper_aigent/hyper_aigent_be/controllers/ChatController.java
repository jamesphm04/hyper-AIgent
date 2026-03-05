package com.hyper_aigent.hyper_aigent_be.controllers;

import com.hyper_aigent.hyper_aigent_be.domain.dtos.chat.GetAnswerDto;
import com.hyper_aigent.hyper_aigent_be.domain.dtos.chat.message.MessageDto;
import com.hyper_aigent.hyper_aigent_be.domain.entities.GGSheetEntity;
import com.hyper_aigent.hyper_aigent_be.domain.entities.upload.FileEntity;
import com.hyper_aigent.hyper_aigent_be.services.interfaces.chat.ChatService;
import com.hyper_aigent.hyper_aigent_be.services.interfaces.file.FileService;
import com.hyper_aigent.hyper_aigent_be.services.interfaces.ggSheet.GGSheetService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
public class ChatController {
    final private ChatService chatService;
    final private FileService fileService;
    final private GGSheetService ggSheetService;

    public ChatController(ChatService chatService,
                          FileService fileService,
                          GGSheetService ggSheetService) {
        this.chatService = chatService;
        this.fileService = fileService;

        this.ggSheetService = ggSheetService;
    }

    @PatchMapping(path = "/api/v2/files/chats/{chatId}")
    public ResponseEntity<?> getAnswer(@PathVariable("chatId") Long chatId,
                                       @RequestBody GetAnswerDto request) {
        String queryContent = request.getContent();
        Optional<FileEntity> file = fileService.findOneByChatId(chatId);

        if (file.isEmpty()) {
            String message = "Error: File not found!";
            System.out.println(message);
            return new ResponseEntity<>(message, HttpStatus.NOT_FOUND);
        }

        Map<String, Object> result = chatService.getAnswer(file.get().getChat(), queryContent, "files");

        String message = (String) result.get("message");
        System.out.println(message);
        if (message.startsWith("Error")) {
            return new ResponseEntity<>(message, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(result.get("content"), HttpStatus.OK);
    }

    @PatchMapping(path = "/api/v2/gg-sheets/chats/{chatId}")
    public ResponseEntity<?> getAnswerGGSheet(@PathVariable("chatId") Long chatId,
                                              @RequestBody GetAnswerDto request) {
        String queryContent = request.getContent();
        Optional<GGSheetEntity> file = ggSheetService.findOneByChatId(chatId);
        if (file.isEmpty()) {
            String message = "Error: File not found!";
            System.out.println(message);
            return new ResponseEntity<>(message, HttpStatus.NOT_FOUND);
        }

        Map<String, Object> result = chatService.getAnswer(file.get().getChat(), queryContent, "gg_sheets");

        String message = (String) result.get("message");
        if (message.startsWith("Error")) {
            return new ResponseEntity<>(message, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(result.get("content"), HttpStatus.OK);
    }

    @GetMapping(path = "api/v2/chats/{chat_id}/history")
    public ResponseEntity<List<MessageDto>> getHistory(@PathVariable("chat_id") Long chatId) {
        List<MessageDto> history = chatService.getHistory(chatId);

        return new ResponseEntity<>(history, HttpStatus.OK);
    }
}
