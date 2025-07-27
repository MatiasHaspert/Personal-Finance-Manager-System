package com.example.personal_finance_manager.DTOs;

import lombok.AllArgsConstructor;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponseDTO {
    private String token;
    private UsuarioResponseDTO usuarioResponseDTO;
}
