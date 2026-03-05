package com.hyper_aigent.hyper_aigent_be.services.externalServices.spread_sheet.impl;

import com.hyper_aigent.hyper_aigent_be.domain.dtos.external.FetchGGSheetRequest;
import com.hyper_aigent.hyper_aigent_be.domain.dtos.external.FetchGGSheetResponse;
import com.hyper_aigent.hyper_aigent_be.domain.dtos.external.HandleConversationRequest;
import com.hyper_aigent.hyper_aigent_be.domain.dtos.external.HandleConversationResponse;
import com.hyper_aigent.hyper_aigent_be.services.externalServices.spread_sheet.SpreadSheetService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class SpreadSheetServiceImpl implements SpreadSheetService {
    @Value("${service.sheet.url}")
    private String baseUrl;

    @Override
    public HandleConversationResponse handleConversation(HandleConversationRequest requestObj) {
        try {
            // Create an HTTP Client
            HttpClient client = HttpClient.newHttpClient();

            JSONObject jsonRequest = new JSONObject();
            jsonRequest.put("question", requestObj.getQuestion());
            jsonRequest.put("chatId", requestObj.getChatId());
            jsonRequest.put("source", requestObj.getSource());
            jsonRequest.put("history", requestObj.getHistory());

            String jsonBody = jsonRequest.toString();

            // Build the request
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(new URI(baseUrl + "/chats/conversation"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() == 200) {
                JSONObject jsonResponse = new JSONObject(response.body());

                return HandleConversationResponse.builder()
                        .answer(jsonResponse.optString("answer", "No answer available"))
                        .image(jsonResponse.optString("image", null))
                        .script(jsonResponse.optString("script", null))
                        .build();
            }

            return new HandleConversationResponse("Error: Received status code " + 500, "Error: Received status code " + 500, null, null);

        } catch (Exception e) {
            return new HandleConversationResponse("Error: Unable to call the Sheet service", "Error: Received status code " + 500, null, null);
        }
    }

    @Override
    public String preprocessFile(Long chatID) {
        try {
            // Create an HTTP Client
            HttpClient client = HttpClient.newHttpClient();

            String url = baseUrl + "/files/preprocess/" + chatID;

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(new URI(url))
                    .GET()
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                JSONObject jsonResponse = new JSONObject(response.body());

                return jsonResponse.optString("message", "No message available");
            } else {
                return "Error: Received status code " + response.statusCode();
            }
        } catch (Exception e) {
            return "Error: Unable to preprocess the file. Exception: " + e.getMessage();
        }
    }

    @Override
    public FetchGGSheetResponse fetchGGSheet(FetchGGSheetRequest requestObj) {
        try {
            // Create an HTTP Client
            HttpClient client = HttpClient.newHttpClient();

            JSONObject jsonRequest = new JSONObject();
            jsonRequest.put("url", requestObj.getUrl());
            jsonRequest.put("chatId", requestObj.getChatId());

            String jsonBody = jsonRequest.toString();

            // Build the request
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(new URI(baseUrl + "/gg_sheets/fetch"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() == 200) {
                JSONObject jsonResponse = new JSONObject(response.body());

                return FetchGGSheetResponse.builder()
                        .savedId(Long.valueOf(jsonResponse.optString("saved_id", null)))
                        .name(jsonResponse.optString("name", null))
                        .type(jsonResponse.optString("type", null))
                        .message(jsonResponse.optString("message", null))
                        .build();
            }

            return new FetchGGSheetResponse(null, null, null, "Error: Received status code " + 500);

        } catch (Exception e) {
            return new FetchGGSheetResponse(null, null, null, "Error: Unable to call the Sheet service");
        }
    }
}
