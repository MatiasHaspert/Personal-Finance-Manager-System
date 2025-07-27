package com.example.personal_finance_manager.Services;


import com.example.personal_finance_manager.DTOs.AuthRequestDTO;
import com.example.personal_finance_manager.DTOs.AuthResponseDTO;
import com.example.personal_finance_manager.DTOs.UsuarioRequestDTO;
import com.example.personal_finance_manager.Models.Usuario;
import org.springframework.security.core.Authentication;

public interface AuthService {
    AuthResponseDTO login(AuthRequestDTO request);
    AuthResponseDTO register(UsuarioRequestDTO request);
    Usuario obtenerUsuarioAutenticado(Authentication authentication);
}
