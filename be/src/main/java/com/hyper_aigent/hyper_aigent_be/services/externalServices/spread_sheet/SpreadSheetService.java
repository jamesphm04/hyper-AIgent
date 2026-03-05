package com.hyper_aigent.hyper_aigent_be.services.externalServices.spread_sheet;

import com.hyper_aigent.hyper_aigent_be.domain.dtos.external.FetchGGSheetRequest;
import com.hyper_aigent.hyper_aigent_be.domain.dtos.external.FetchGGSheetResponse;
import com.hyper_aigent.hyper_aigent_be.domain.dtos.external.HandleConversationRequest;
import com.hyper_aigent.hyper_aigent_be.domain.dtos.external.HandleConversationResponse;

public interface SpreadSheetService {
    HandleConversationResponse handleConversation(HandleConversationRequest requestObj);

    String preprocessFile(Long chatID);

    FetchGGSheetResponse fetchGGSheet(FetchGGSheetRequest requestObj);
}
