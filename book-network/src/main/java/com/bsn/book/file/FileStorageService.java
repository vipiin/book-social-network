package com.bsn.book.file;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    String saveFile(MultipartFile sourceFile, Integer userId);
}
