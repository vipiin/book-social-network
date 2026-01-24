package com.bsn.book.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationRequest {
    @Email(message = "Email is not formatter")
    @NotEmpty(message = "Email should not be empty")
    @NotBlank(message = "Email is mandatory")
    private String email;
    @NotEmpty(message = "Password should not be empty")
    @NotBlank(message = "Password is mandatory")
    @Size(min = 8,message = "Password should be 8 characters long minimum")
    private String password;

}
