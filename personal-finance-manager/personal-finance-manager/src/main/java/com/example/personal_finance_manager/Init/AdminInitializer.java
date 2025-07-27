package com.example.personal_finance_manager.Init;

import com.example.personal_finance_manager.Models.ERol;
import com.example.personal_finance_manager.Models.Rol;
import com.example.personal_finance_manager.Models.Usuario;
import com.example.personal_finance_manager.Repositories.RolRepository;
import com.example.personal_finance_manager.Repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.DependsOn;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
@RequiredArgsConstructor
@DependsOn("rolInitializer")
public class AdminInitializer implements ApplicationListener<ContextRefreshedEvent> {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;

    private boolean initialized = false;

    // Garantizo que contexto de la app se haya refrescado y ejecuto los inicializadores cuando las tablas ya existen.
    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        if (initialized) return;
        initialized = true;

        // Solo si no existe el admin
        if (usuarioRepository.findUsuarioByEmail("admin@miapp.com") == null) {
            Rol rolAdmin = rolRepository.findByRol(ERol.ROLE_ADMIN)
                    .orElseThrow(() -> new RuntimeException("Falta el rol ROLE_ADMIN"));

            Usuario admin = new Usuario();
            admin.setEmail("admin@miapp.com");
            admin.setNombre("Administrador");
            admin.setPassword(passwordEncoder.encode("admin123"));

            Set<Rol> roles = new HashSet<>();
            roles.add(rolAdmin);
            admin.setRoles(roles);

            usuarioRepository.save(admin);
        }
    }
}
