package com.skybox.backend.exception;

import java.util.List;

public class ErrorResponse {
    private String message;
    private String error;
    private List<String> supportedFormats;

    public ErrorResponse(String message, String error) {
        this.message = message;
        this.error = error;
    }

    public ErrorResponse(String message, String error, List<String> supportedFormats) {
        this.message = message;
        this.error = error;
        this.supportedFormats = supportedFormats;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public List<String> getSupportedFormats() {
        return supportedFormats;
    }

    public void setSupportedFormats(List<String> supportedFormats) {
        this.supportedFormats = supportedFormats;
    }
}
