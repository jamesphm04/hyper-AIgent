package com.hyper_aigent.hyper_aigent_be.domain.dtos.external;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HandleConversationResponse {
    private String message;
    private String answer;
    private String image;
    private String script;
}
