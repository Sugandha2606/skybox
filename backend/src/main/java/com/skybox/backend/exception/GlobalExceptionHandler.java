package com.skybox.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Arrays;
import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final List<String> SUPPORTED_FORMATS = Arrays.asList(
            "TXT (text/plain)",
            "CSV (text/csv)",
            "XML (text/xml)",
            "Markdown (text/markdown)",
            "HTML (text/html)",
            "PNG (image/png)",
            "JPG/JPEG (image/jpeg)",
            "PDF (application/pdf)",
            "DOC (application/msword)",
            "DOCX (application/vnd.openxmlformats-officedocument.wordprocessingml.document)");

    @ExceptionHandler(FileUploadException.class)
    public ResponseEntity<ErrorResponse> handleFileUploadException(FileUploadException ex) {
        ErrorResponse response = new ErrorResponse(
                ex.getMessage(),
                "File Upload Error",
                SUPPORTED_FORMATS);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException ex) {
        ErrorResponse response = new ErrorResponse(
                ex.getMessage(),
                "Error");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
