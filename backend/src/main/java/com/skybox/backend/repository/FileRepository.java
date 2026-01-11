package com.skybox.backend.repository;

import com.skybox.backend.entity.FileMetaData;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface FileRepository extends JpaRepository<FileMetaData, UUID> {
}
