package com.example.personal_finance_manager.DTOs;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthRequestDTO {

    @NotBlank
    @Email
    String email;

    @NotBlank
    @Size(min = 6, max = 30, message = "La contraseña debe tener entre 6 y 30 caracteres")
    String password;
}
