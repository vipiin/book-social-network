package com.bsn.book.file;

import io.micrometer.common.util.StringUtils;
import lombok.extern.slf4j.Slf4j;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;

@Slf4j
public class FileUtils {

    public static byte[] readFileFromLocation(String fileUrl) {
        if (StringUtils.isBlank(fileUrl)) {
            return null;
        }
        try {
            // Check if it's a URL (Cloudinary) or local path
            if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
                // Read from URL (Cloudinary)
                URL url = new URL(fileUrl);
                try (InputStream inputStream = url.openStream()) {
                    return inputStream.readAllBytes();
                }
            } else {
                // Read from local file system
                Path filePath = new File(fileUrl).toPath();
                return Files.readAllBytes(filePath);
            }
        } catch (IOException e) {
            log.warn("No file found in the path {}", fileUrl);
        }
        return null;
    }
}
