package com.hyper_aigent.hyper_aigent_be.services.impl.file;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hyper_aigent.hyper_aigent_be.domain.dtos.upload.UploadFileResponse;
import com.hyper_aigent.hyper_aigent_be.domain.entities.ChatEntity;
import com.hyper_aigent.hyper_aigent_be.domain.entities.UserEntity;
import com.hyper_aigent.hyper_aigent_be.domain.entities.upload.FileEntity;
import com.hyper_aigent.hyper_aigent_be.repositories.FileRepository;
import com.hyper_aigent.hyper_aigent_be.services.externalServices.spread_sheet.SpreadSheetService;
import com.hyper_aigent.hyper_aigent_be.services.interfaces.chat.ChatService;
import com.hyper_aigent.hyper_aigent_be.services.interfaces.file.FileService;
import com.hyper_aigent.hyper_aigent_be.services.interfaces.user.UserService;
import jakarta.transaction.Transactional;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class FileServiceImpl implements FileService {
    final private FileRepository fileRepository;
    final private UserService userService;
    final private ChatService chatService;

    final private SpreadSheetService spreadSheetService;

    public FileServiceImpl(FileRepository fileRepository,
                           UserService userService,
                           ChatService chatService,
                           SpreadSheetService spreadSheetService) {
        this.fileRepository = fileRepository;
        this.userService = userService;
        this.chatService = chatService;

        this.spreadSheetService = spreadSheetService;
    }

    @Override
    public FileEntity saveToDB(FileEntity fileEntity) {
        return fileRepository.save(fileEntity);
    }

    @Override
    @Transactional
    public Optional<FileEntity> findOneByChatId(Long chatId) {
        return fileRepository.findByChatId(chatId);
    }

    @Override
    @Transactional
    public Optional<FileEntity> findOneById(Long id) {
        return fileRepository.findById(id);
    }

    @Override
    public List<Object[]> findAllByUserId(Long userId) {
        return fileRepository.findAllByUserId(userId);
    }

    private String extractInitialColumnDescription(MultipartFile file) throws IOException {
        Map<String, Map<String, String>> description = new LinkedHashMap<>();

        if (file.getOriginalFilename().endsWith(".csv")) {
            try (Scanner scanner = new Scanner(file.getInputStream())) {
                if (scanner.hasNextLine()) {
                    String[] headers = scanner.nextLine().split(",");
                    Map<String, String> columns = Arrays.stream(headers)
                            .collect(Collectors.toMap(h -> h.trim(), h -> "", (a, b) -> b, LinkedHashMap::new));
                    description.put("CSV", columns);
                }
            }
        } else if (file.getOriginalFilename().endsWith(".xlsx")) {
            try (InputStream is = file.getInputStream();
                 Workbook workbook = new XSSFWorkbook(is)) {
                for (int i = 0; i < workbook.getNumberOfSheets(); i++) {
                    Sheet sheet = workbook.getSheetAt(i);
                    Row headerRow = sheet.getRow(0);
                    if (headerRow == null) continue;

                    Map<String, String> columns = new LinkedHashMap<>();
                    for (Cell cell : headerRow) {
                        columns.put(cell.getStringCellValue(), "");
                    }

                    description.put(workbook.getSheetName(i), columns);
                }
            }
        }

        ObjectMapper mapper = new ObjectMapper();
        return mapper.writerWithDefaultPrettyPrinter().writeValueAsString(description);
    }

    @Override
    public UploadFileResponse uploadFile(Long userId, MultipartFile file) throws IOException {
        UploadFileResponse response = new UploadFileResponse();

        if (file == null || file.isEmpty()) {
            response.setMessage("Error: File not found!");
            return response;
        }

        // Check file type (CSV or XLSX)
        String fileName = file.getOriginalFilename();
        if (fileName == null || (!fileName.endsWith(".csv") && !fileName.endsWith(".xlsx"))) {
            response.setMessage("Error: Only CSV and XLSX files are supported!");
            return response;
        }

        // Check user
        Optional<UserEntity> user = userService.findById(userId);
        if (user.isEmpty()) {
            response.setMessage("Error: User not found!");
            return response;
        }

        // Create new chat entity
        ChatEntity newChat = ChatEntity.builder()
                .user(user.get())
                .topic("This is a default topic")
                .build();
        ChatEntity createdChat = chatService.create(newChat);

        // Extract initial column description
        String columnDescriptionJson = extractInitialColumnDescription(file);

        System.out.println(columnDescriptionJson);

        // Save file
        FileEntity fileEntity = FileEntity.builder()
                .name(fileName)
                .type(fileName.endsWith(".csv") ? "CSV" : "XLSX")
                .content(file.getBytes())
                .columnDescriptions(columnDescriptionJson)
                .size(file.getSize())
                .chat(createdChat)
                .build();

        FileEntity uploadedFile = saveToDB(fileEntity);

        // clean the file
        if (Objects.equals(uploadedFile.getType(), "XLSX")) {
            System.out.println("FILE ID: " + uploadedFile.getId());
            String message = spreadSheetService.preprocessFile(createdChat.getId());
            System.out.println("Message for preprocess file: " + message);
        }

        // Build response
        response.setId(uploadedFile.getId());
        response.setName(uploadedFile.getName());
        response.setType(uploadedFile.getType());
        response.setMessage("File uploaded successfully!");

        return response;
    }

    @Override
    @Transactional
    public Boolean updateColumnDescription(Long id, String columnDescriptions) {
        Optional<FileEntity> file = findOneById(id);

        if (file.isEmpty()) {
            return false;
        }

        fileRepository.updateColumnDescriptionsById(id, columnDescriptions);
        return true;
    }

    @Override
    public Map<String, Object> getColumnDescriptions(Long id) throws JsonProcessingException {
        Optional<FileEntity> file = findOneById(id);

        Map<String, Object> result = new HashMap<>();

        if (file.isEmpty()) {
            result.put("message", "Error: File not found!");
            return result;
        }

        String columnDescriptionsStr = file.get().getColumnDescriptions();

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, String> columnDescriptionsMap = objectMapper.readValue(columnDescriptionsStr, Map.class);

        result.put("message", "Success");
        result.put("content", columnDescriptionsMap);
        return result;
    }

    @Override
    public Map<String, Object> getAllFileInfo(Long userId) {
        Map<String, Object> result = new HashMap<>();
        Optional<UserEntity> user = userService.findById(userId);

        if (user.isEmpty()) {
            result.put("message", "Error: User not found!");
            return result;
        }

        List<Object[]> fileList = findAllByUserId(userId);

        List<Map<String, Object>> mappedFileList = new ArrayList<>();

        for (Object[] file : fileList) {
            Map<String, Object> fileMap = new HashMap<>();

            fileMap.put("id", file[0]);
            fileMap.put("name", file[1]);
            fileMap.put("chatID", file[2]);

            mappedFileList.add(fileMap);
        }

        result.put("message", "Success");
        result.put("content", mappedFileList);

        return result;
    }

    @Override
    @Transactional
    public Map<String, Object> getFile(Long id) {
        Map<String, Object> result = new HashMap<>();
        Optional<FileEntity> file = findOneById(id);
        if (file.isEmpty()) {
            result.put("message", "Error: File not found!");
            return result;
        }

        FileEntity foundFile = file.get();
        String fileName = foundFile.getName();
        result.put("fileName", fileName);
        byte[] fileContent = foundFile.getContent();
        result.put("content", fileContent);
        Long chatId = foundFile.getChat().getId();
        result.put("chatId", chatId);

        // Determine content type based on file extension
        String contentType = fileName.endsWith(".xlsx") ?
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" :
                "text/csv";

        // Set headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(contentType));
        headers.setContentDispositionFormData("attachment", fileName);
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
        result.put("headers", headers);

        result.put("message", "Success");
        return result;
    }
}
