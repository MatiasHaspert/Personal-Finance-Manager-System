package com.example.personal_finance_manager.Security;

import com.example.personal_finance_manager.Models.Rol;
import com.example.personal_finance_manager.Models.Usuario;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@AllArgsConstructor
public class UserDetailsImpl implements UserDetails {

    private Long id;
    private String email;
    private String nombre;
    private String password;
    private Set<Rol> roles;

    // Indico roles del usuario
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Set<SimpleGrantedAuthority> simpleGrantedAuthorities = new HashSet<>();
        for(Rol rol : this.roles){
            SimpleGrantedAuthority simpleGrantedAuthority = new SimpleGrantedAuthority(rol.getRol().name());
            simpleGrantedAuthorities.add(simpleGrantedAuthority);
        }
        return simpleGrantedAuthorities;
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    public static UserDetailsImpl aUserDetailsImpl(Usuario usuario) {
        UserDetailsImpl userDetails = new UserDetailsImpl(
                usuario.getId(),
                usuario.getEmail(),
                usuario.getNombre(),
                usuario.getPassword(),
                usuario.getRoles()
        );

        return userDetails;
    }
    
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

}
