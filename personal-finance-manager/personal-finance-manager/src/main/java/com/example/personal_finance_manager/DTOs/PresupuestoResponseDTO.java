package com.example.personal_finance_manager.DTOs;

import com.example.personal_finance_manager.Models.TipoCategoria;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.processing.Exclude;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PresupuestoResponseDTO {

    private Long id;
    LocalDate fecha;
    private TipoCategoria categoria;
    private BigDecimal montoRestante;
    private BigDecimal montoPresupuestado;
    private BigDecimal montoGastos;
    private BigDecimal porcentajeEjecutado;

    private String mensaje;

}
