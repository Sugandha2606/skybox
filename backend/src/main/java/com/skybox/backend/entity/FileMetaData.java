package com.skybox.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "files")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FileMetaData {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String originalFileName;

    private String storedFileName;

    private String contentType;

    private long size;

    private String storagePath;

    private LocalDateTime createdAt;
}
