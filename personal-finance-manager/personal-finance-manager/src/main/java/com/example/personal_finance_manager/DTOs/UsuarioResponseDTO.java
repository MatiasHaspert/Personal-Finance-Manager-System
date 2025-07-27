package com.example.personal_finance_manager.DTOs;

import com.example.personal_finance_manager.Models.Rol;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioResponseDTO {

    private Long id;
    private String nombre;
    private String email;

    @JsonIgnoreProperties({"usuarios", "id"})
    private List<String> roles;
}
