package com.cinepass.user.dto;

public class LoginResponse {

    private String token;
    private String tokenType;
    private String message;

    public LoginResponse() {
    }

    public LoginResponse(String token, String tokenType, String message) {
        this.token = token;
        this.tokenType = tokenType;
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}