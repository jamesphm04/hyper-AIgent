package com.hyper_aigent.hyper_aigent_be.domain.dtos.external;

import com.hyper_aigent.hyper_aigent_be.domain.dtos.chat.message.MessageWithoutImageDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HandleConversationRequest {
    private String question;
    private Long chatId;
    private String source;
    private List<MessageWithoutImageDto> history;
}
