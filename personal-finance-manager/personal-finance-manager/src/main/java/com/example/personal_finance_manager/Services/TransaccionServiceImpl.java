package com.example.personal_finance_manager.Services;

import com.example.personal_finance_manager.DTOs.CategoriaMontoDTO;
import com.example.personal_finance_manager.DTOs.PaginacionResponseDTO;
import com.example.personal_finance_manager.DTOs.TransaccionRequestDTO;
import com.example.personal_finance_manager.DTOs.TransaccionResponseDTO;
import com.example.personal_finance_manager.Exceptions.NotFoundException;
import com.example.personal_finance_manager.Models.TipoTransaccion;
import com.example.personal_finance_manager.Models.Transaccion;
import com.example.personal_finance_manager.Models.Usuario;
import com.example.personal_finance_manager.Repositories.TransaccionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Primary
@Service
@Transactional
public class TransaccionServiceImpl implements TransaccionService{

    private TransaccionRepository transaccionRepository;

    @Autowired
    public TransaccionServiceImpl(TransaccionRepository transaccionRepository){
        this.transaccionRepository = transaccionRepository;
    }

    public PaginacionResponseDTO<TransaccionResponseDTO> getTransacciones(Long id, LocalDate fecha, int page, int size) {
        // Retorna la primera página (0 default) con (10 default) elementos, ordenada por el campo fecha en orden descendente.
        Pageable pageable = PageRequest.of(page, size, Sort.by("fecha").descending());
        Page<Transaccion> transaccionesPage = transaccionRepository.findTransaccionesPaginadasByUsuarioAndFecha(id, fecha.getYear(), fecha.getMonthValue(),  pageable);

        Page<TransaccionResponseDTO> dtoPage = transaccionesPage.map(this::aTransaccionResponseDTO);

        PaginacionResponseDTO<TransaccionResponseDTO> response = new PaginacionResponseDTO<>();
        response.setContenido(dtoPage.getContent());
        response.setPaginaActual(dtoPage.getNumber());
        response.setTotalPaginas(dtoPage.getTotalPages());
        response.setTotalElementos(dtoPage.getTotalElements());
        response.setUltimaPagina(dtoPage.isLast());

        return response;
    }

    public TransaccionResponseDTO crearTransaccion(TransaccionRequestDTO transaccionRequestDTO, Usuario usuario) {
        Transaccion transaccion = aTransaccionEntity(transaccionRequestDTO, usuario);
        return aTransaccionResponseDTO(transaccionRepository.save(transaccion));
    }

    public TransaccionResponseDTO actualizarTransaccion(Long id, TransaccionRequestDTO transaccionRequestDTO, Usuario usuario) {
        Transaccion transaccion = transaccionRepository.findById(id).orElseThrow(() -> new NotFoundException("Transacción no encontrada"));

        if(!transaccion.getUsuario().getId().equals(usuario.getId())){
            throw new AccessDeniedException("No tenes permiso para esta operación");
        }
        transaccionRequestDTO.setId(id);

        return aTransaccionResponseDTO(transaccionRepository.save(aTransaccionEntity(transaccionRequestDTO, usuario)));
    }

    public void eliminarTransaccion(Long id, Usuario usuario) {
        Transaccion transaccion = transaccionRepository.findById(id).orElseThrow(() -> new NotFoundException("Transacción no encontrada"));

        if(!transaccion.getUsuario().getId().equals(usuario.getId())){
            throw new AccessDeniedException("No tenes permiso para esta operación");
        }

        transaccionRepository.deleteTransaccionByIdAndUsuario(id,usuario);
    }

    public List<TransaccionResponseDTO> getTransaccionesPorTipo(Usuario usuario, TipoTransaccion tipoTransaccion, LocalDate fecha) {
        List<Transaccion> transacciones = transaccionRepository.findTransaccionesByUsuarioAndTipoTransaccionAndFecha(usuario.getId(), tipoTransaccion, fecha.getYear(), fecha.getMonthValue());

        return transacciones.stream().map(this::aTransaccionResponseDTO).toList();
    }


    public BigDecimal getSaldoMensual(Long id, LocalDate fecha) {
        BigDecimal ingresosTotales, gastosTotales;

        ingresosTotales = getMontoTotalMensualPorTipo(id, TipoTransaccion.INGRESO, fecha);
        gastosTotales = getMontoTotalMensualPorTipo(id, TipoTransaccion.GASTO, fecha);

        return ingresosTotales.subtract(gastosTotales);
    }

    public List<CategoriaMontoDTO> getCategoriaMontoTotalPorTipo(Long id, TipoTransaccion tipo, LocalDate fecha) {
        return transaccionRepository.getCategoriaMontoByUsuarioAndTipoAndFecha(id, tipo.name(), fecha.getYear(), fecha.getMonthValue());
    }

    public BigDecimal getMontoTotalMensualPorTipo(Long id, TipoTransaccion tipoTransaccion, LocalDate fecha) {
        return transaccionRepository.sumMontoTransaccionesByUsuarioAndTipoAndFecha(id, tipoTransaccion, fecha.getYear(), fecha.getMonthValue());
    }

    public Transaccion aTransaccionEntity(TransaccionRequestDTO transaccionRequestDTO, Usuario usuario) {
        Transaccion transaccion = new Transaccion();

        transaccion.setId(transaccionRequestDTO.getId());
        transaccion.setUsuario(usuario);
        transaccion.setTipoTransaccion(transaccionRequestDTO.getTipoTransaccion());
        transaccion.setFecha(transaccionRequestDTO.getFecha());
        transaccion.setDescripcion(transaccionRequestDTO.getDescripcion());
        transaccion.setMonto(transaccionRequestDTO.getMonto());
        transaccion.setCategoria(transaccionRequestDTO.getCategoria());
        return transaccion;
    }

    public TransaccionResponseDTO aTransaccionResponseDTO(Transaccion transaccion){
        TransaccionResponseDTO transaccionResponseDTO = new TransaccionResponseDTO();

        transaccionResponseDTO.setId(transaccion.getId());
        transaccionResponseDTO.setDescripcion(transaccion.getDescripcion());
        transaccionResponseDTO.setTipoTransaccion(transaccion.getTipoTransaccion());
        transaccionResponseDTO.setMonto(transaccion.getMonto());
        transaccionResponseDTO.setCategoria(transaccion.getCategoria());
        transaccionResponseDTO.setFecha(transaccion.getFecha());

        return transaccionResponseDTO;
    }
}
