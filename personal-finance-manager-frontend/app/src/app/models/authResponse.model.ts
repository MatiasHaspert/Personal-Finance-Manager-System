import { UsuarioResponseDTO } from "./user.model";
export interface AuthResponse {
    token : string,
    usuarioResponseDTO : UsuarioResponseDTO;
}