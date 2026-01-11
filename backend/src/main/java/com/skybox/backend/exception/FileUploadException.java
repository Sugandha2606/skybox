package com.skybox.backend.exception;

public class FileUploadException extends RuntimeException {
    private String supportedTypes;

    public FileUploadException(String message) {
        super(message);
    }

    public FileUploadException(String message, String supportedTypes) {
        super(message);
        this.supportedTypes = supportedTypes;
    }

    public String getSupportedTypes() {
        return supportedTypes;
    }
}
