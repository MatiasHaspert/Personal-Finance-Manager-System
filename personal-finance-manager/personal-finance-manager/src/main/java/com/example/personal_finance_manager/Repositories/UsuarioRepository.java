package com.example.personal_finance_manager.Repositories;

import com.example.personal_finance_manager.DTOs.UsuarioResponseDTO;
import com.example.personal_finance_manager.Models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    boolean existsByEmail(String email);

    @Query("""
    SELECT u FROM Usuario u
    JOIN FETCH u.roles
    WHERE u.email = :email
    """)
    Usuario findUsuarioByEmail(@Param("email") String email);

}
