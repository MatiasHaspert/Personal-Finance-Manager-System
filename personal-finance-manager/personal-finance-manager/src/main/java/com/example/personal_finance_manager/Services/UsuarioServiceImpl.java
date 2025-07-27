package com.example.personal_finance_manager.Services;

import com.example.personal_finance_manager.DTOs.UsuarioRequestDTO;
import com.example.personal_finance_manager.DTOs.UsuarioResponseDTO;
import com.example.personal_finance_manager.DTOs.UsuarioUpdateDTO;
import com.example.personal_finance_manager.Exceptions.BadRequestException;
import com.example.personal_finance_manager.Exceptions.NotFoundException;
import com.example.personal_finance_manager.Models.ERol;
import com.example.personal_finance_manager.Models.Rol;
import com.example.personal_finance_manager.Models.Usuario;
import com.example.personal_finance_manager.Repositories.RolRepository;
import com.example.personal_finance_manager.Repositories.UsuarioRepository;
import com.example.personal_finance_manager.Security.UserDetailsImpl;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Primary;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;



@Primary
@Transactional
@RequiredArgsConstructor
@Service
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final RolRepository rolRepository;

    public Usuario obtenerUsuarioPorEmail(String email) {
        return usuarioRepository.findUsuarioByEmail(email);
    }

    public UsuarioResponseDTO crearUsuario(UsuarioRequestDTO usuarioRequestDTO){
        boolean isExistUsuario = usuarioRepository.existsByEmail(usuarioRequestDTO.getEmail());
        if(isExistUsuario){
           throw new BadRequestException("Usuario ya registrado");
        }
        Usuario usuario = usuarioRepository.save(aUsuarioEntity(usuarioRequestDTO));
        return aUsuarioResponseDTO(usuario);
    }

    public UsuarioResponseDTO actualizarUsuario(Long id, UsuarioUpdateDTO dto){
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado"));

        usuario.setNombre(dto.getNombre());

        if (dto.getNuevaPassword() != null && !dto.getNuevaPassword().isBlank()) {
            if (dto.getPasswordActual() == null || !passwordEncoder.matches(dto.getPasswordActual(), usuario.getPassword())) {
                throw new BadRequestException("La contraseña actual es incorrecta");
            }
            usuario.setPassword(passwordEncoder.encode(dto.getNuevaPassword()));
        }

        usuarioRepository.save(usuario);
        return aUsuarioResponseDTO(usuario);
    }

    public List<UsuarioResponseDTO> obtenerTodosLosUsuarios() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        List<UsuarioResponseDTO> usuarioResponseDTOList = new ArrayList<>();

        for (Usuario user : usuarios){
            usuarioResponseDTOList.add(aUsuarioResponseDTO(user));
        }

        return usuarioResponseDTOList;
    }


    public void eliminarUsuario(Long usuarioId) {
        if(!usuarioRepository.existsById(usuarioId)){
            throw new NotFoundException("Usuario no encontrado");
        }
        usuarioRepository.deleteById(usuarioId);
    }

    public void asignarRolaUsuario(Long usuarioId, ERol rol) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado"));

        Rol rolEntity = rolRepository.findByRol(rol)
                .orElseThrow(() -> new NotFoundException("Rol no encontrado"));

        // Si el usuario ya tiene el rol, evitamos duplicación
        if(usuario.getRoles().contains(rolEntity)){
            throw new BadRequestException("Usuario ya tiene el rol.");
        }

        usuario.getRoles().add(rolEntity);
        usuarioRepository.save(usuario);

    }

    public void eliminarRolaUsuario(Long usuarioId, ERol rol){

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado"));

        // Eliminar el rol del set
        usuario.getRoles().removeIf(r -> r.getRol() == rol);

        usuarioRepository.save(usuario);
    }

    public UsuarioResponseDTO aUsuarioResponseDTO(Usuario usuario) {
        UsuarioResponseDTO usuarioResponseDTO = new UsuarioResponseDTO();

        usuarioResponseDTO.setId(usuario.getId());
        usuarioResponseDTO.setEmail(usuario.getEmail());
        usuarioResponseDTO.setNombre(usuario.getNombre());
        List<String> roles = usuario.getRoles().stream().map(r -> r.getRol().name()).toList();
        usuarioResponseDTO.setRoles(roles);
        return usuarioResponseDTO;
    }

    public Usuario aUsuarioEntity(UsuarioRequestDTO usuarioRequestDTO){
        Usuario usuario = new Usuario();

        usuario.setEmail(usuarioRequestDTO.getEmail());
        usuario.setNombre(usuarioRequestDTO.getNombre());
        usuario.setPassword(passwordEncoder.encode(usuarioRequestDTO.getPassword()));

        Rol rolUser = rolRepository.findByRol(ERol.ROLE_USER)
                .orElseThrow(() -> new NotFoundException("Falta el rol ROLE_USER"));

        usuario.setRoles(new HashSet<>(Set.of(rolUser))); // Fuerzo registrar usuario

        return usuario;
    }

    public UsuarioResponseDTO aUsuarioResponseDTOFromUserDetails(UserDetailsImpl userDetails) {
        UsuarioResponseDTO dto = new UsuarioResponseDTO();
        dto.setId(userDetails.getId());
        dto.setEmail(userDetails.getEmail());
        dto.setNombre(userDetails.getNombre());
        List<String> roles = userDetails.getRoles().stream().map(r -> r.getRol().name()).toList();
        dto.setRoles(roles);
        return dto;
    }
}
