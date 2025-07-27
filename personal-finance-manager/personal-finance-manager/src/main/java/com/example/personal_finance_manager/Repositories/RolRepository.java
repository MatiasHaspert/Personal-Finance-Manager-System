package com.example.personal_finance_manager.Repositories;

import com.example.personal_finance_manager.Models.ERol;
import com.example.personal_finance_manager.Models.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RolRepository extends JpaRepository<Rol, Long> {
    Optional<Rol> findByRol(ERol eRol);
}
