package com.example.personal_finance_manager.Init;

import com.example.personal_finance_manager.Models.ERol;
import com.example.personal_finance_manager.Models.Rol;
import com.example.personal_finance_manager.Repositories.RolRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RolInitializer implements ApplicationListener<ContextRefreshedEvent> {

    private final RolRepository rolRepository;
    private boolean initialized = false;

    // Garantizo que contexto de la app se haya refrescado y ejecuto los inicializadores cuando las tablas ya existen.
    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        if(initialized) return;

        initialized = true;

        // Cargar ROLE_ADMIN si no existe
        if (rolRepository.findByRol(ERol.ROLE_ADMIN).isEmpty()) {
            Rol rolAdmin = new Rol();
            rolAdmin.setRol(ERol.ROLE_ADMIN);
            rolRepository.save(rolAdmin);
        }

        // Cargar ROLE_USER si no existe
        if (rolRepository.findByRol(ERol.ROLE_USER).isEmpty()) {
            Rol rolUser = new Rol();
            rolUser.setRol(ERol.ROLE_USER);
            rolRepository.save(rolUser);
        }
    }
}
