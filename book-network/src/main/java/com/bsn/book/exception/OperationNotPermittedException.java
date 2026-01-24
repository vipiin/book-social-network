package com.bsn.book.exception;


//always handle the xception in globalexception handler
public class OperationNotPermittedException extends RuntimeException {
    public OperationNotPermittedException(String msg) {
    super(msg);
    }
}
