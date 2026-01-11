package com.skybox.backend.service;

import com.skybox.backend.entity.FileMetaData;
import com.skybox.backend.exception.FileUploadException;
import com.skybox.backend.repository.FileRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileStorageService {

    private final FileRepository fileRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    private static final Set<String> ALLOWED_TYPES = Set.of(
            "text/plain",
            "text/csv",
            "text/xml",
            "text/markdown",
            "text/html",
            "image/png",
            "image/jpeg",
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document");

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(Paths.get(uploadDir));
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory", e);
        }
    }

    public List<FileMetaData> getAllFiles() {
        return fileRepository.findAll();
    }

    public Resource downloadFile(UUID id) {
        FileMetaData file = fileRepository.findById(id).orElseThrow(() -> new RuntimeException("File Not found"));

        Path path = Paths.get(file.getStoragePath());

        try {
            return new UrlResource(path.toUri());
        } catch (MalformedURLException e) {
            throw new RuntimeException("File not found");
        }
    }

    public FileMetaData uploadFile(MultipartFile file) {

        // 1. Validate file
        if (file.isEmpty()) {
            throw new FileUploadException("File is empty");
        }

        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            throw new FileUploadException("File type not supported: " + file.getContentType());
        }

        // 2. Generate safe filename
        String originalName = file.getOriginalFilename();
        String storedName = UUID.randomUUID() + "_" + originalName;

        Path filePath = Paths.get(uploadDir).resolve(storedName);

        // 3. Save file to disk
        try {
            Files.copy(file.getInputStream(), filePath);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }

        // 4. Save metadata to DB
        FileMetaData metadata = FileMetaData.builder()
                .originalFileName(originalName)
                .storedFileName(storedName)
                .contentType(file.getContentType())
                .size(file.getSize())
                .storagePath(filePath.toString())
                .createdAt(LocalDateTime.now())
                .build();

        return fileRepository.save(metadata);
    }

    public void deleteFile(UUID id) {
        FileMetaData file = fileRepository.findById(id).orElseThrow(() -> new RuntimeException("File Not found"));

        try {
            Files.deleteIfExists(Paths.get(file.getStoragePath()));
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file from the disk");
        }

        fileRepository.delete(file);
    }

    public FileMetaData getFileMetadata(UUID id) {
        return fileRepository.findById(id).orElseThrow(() -> new RuntimeException("File Not Found"));
    }
}
