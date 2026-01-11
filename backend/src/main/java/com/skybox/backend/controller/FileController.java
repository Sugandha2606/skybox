package com.skybox.backend.controller;

import com.skybox.backend.entity.FileMetaData;
import com.skybox.backend.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class FileController {

    private final FileStorageService fileStorageService;

    @GetMapping
    public ResponseEntity<List<FileMetaData>> getAllFiles(){
        return ResponseEntity.ok(fileStorageService.getAllFiles());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FileMetaData> getFileMetadata(
            @PathVariable UUID id
    ){
        FileMetaData file = fileStorageService.getFileMetadata(id);
        return ResponseEntity.ok(file);
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadFile(
            @PathVariable UUID id
    ){
        FileMetaData file = fileStorageService.getFileMetadata(id);
        Resource resource = fileStorageService.downloadFile(id);

        return ResponseEntity.ok().contentType(MediaType.parseMediaType(file.getContentType())).header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\""+file.getOriginalFileName()+"\"").body(resource);
    }

    @PostMapping("/upload")
    public ResponseEntity<FileMetaData> uploadFile(
            @RequestParam("file") MultipartFile file
    ) {
        FileMetaData saved = fileStorageService.uploadFile(file);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFile(
            @PathVariable UUID id
    ){
        fileStorageService.deleteFile(id);
        return ResponseEntity.noContent().build();
    }

}

