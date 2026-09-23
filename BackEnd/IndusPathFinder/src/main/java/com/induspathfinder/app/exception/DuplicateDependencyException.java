package com.induspathfinder.app.exception;

public class DuplicateDependencyException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public DuplicateDependencyException(String message) {
        super(message);
    }
}