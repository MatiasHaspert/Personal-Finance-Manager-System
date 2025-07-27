package com.example.personal_finance_manager.Controllers;

import com.example.personal_finance_manager.DTOs.UsuarioResponseDTO;
import com.example.personal_finance_manager.Models.ERol;
import com.example.personal_finance_manager.Services.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "http://localhost:4200")
public class AdminController {

    private final UsuarioService usuarioService;

    @GetMapping("/usuarios")
    public ResponseEntity<List<UsuarioResponseDTO>> listarUsuarios() {
        return ResponseEntity.ok(usuarioService.obtenerTodosLosUsuarios());
    }

    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<?> eliminarUsuario(@PathVariable Long id) {
        usuarioService.eliminarUsuario(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/usuarios/{id}/rol")
    public ResponseEntity<?> asignarRol(@PathVariable Long id, @RequestParam ERol rol) {
        usuarioService.asignarRolaUsuario(id, rol);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/usuarios/{id}/eliminar-rol-a-usuario")
    public ResponseEntity<?> eliminarRolaUsuario(@PathVariable Long id, @RequestParam ERol rol){
        usuarioService.eliminarRolaUsuario(id, rol);
        return ResponseEntity.noContent().build();
    }
}
