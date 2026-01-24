package com.bsn.book.file;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@Slf4j
@Profile("prod")
@RequiredArgsConstructor
public class CloudinaryFileStorageService implements FileStorageService {

    private final Cloudinary cloudinary;

    @Override
    public String saveFile(
            @NonNull MultipartFile sourceFile,
            @NonNull Integer userId) {
        try {
            Map<?, ?> uploadResult = cloudinary.uploader().upload(sourceFile.getBytes(),
                    ObjectUtils.asMap("folder", "bsn/users/" + userId));
            String secureUrl = (String) uploadResult.get("secure_url");
            log.info("File uploaded to Cloudinary: " + secureUrl);
            return secureUrl;
        } catch (IOException e) {
            log.error("Cloudinary upload failed", e);
        }
        return null;
    }
}
