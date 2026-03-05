package com.hyper_aigent.hyper_aigent_be.domain.dtos.external;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FetchGGSheetResponse {
    private Long savedId;
    private String name;
    private String type;
    private String message;
}