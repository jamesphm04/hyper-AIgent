package com.hyper_aigent.hyper_aigent_be.domain.dtos.ggSheet;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FetchByUrlResponse {
    private Long id;
    private String name;
    private String type;
    private String message;
    private byte[] content;
}
