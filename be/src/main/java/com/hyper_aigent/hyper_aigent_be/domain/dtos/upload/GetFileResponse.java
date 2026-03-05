package com.hyper_aigent.hyper_aigent_be.domain.dtos.upload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.http.HttpHeaders;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GetFileResponse {
    private byte[] fileContent;
    private HttpHeaders headers;
    private Long chatId;
    private String fileName;
}
