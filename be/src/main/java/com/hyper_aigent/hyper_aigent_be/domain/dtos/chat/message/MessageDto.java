package com.hyper_aigent.hyper_aigent_be.domain.dtos.chat.message;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MessageDto {
    private String role;
    private String content;
    private byte[] image;
}
