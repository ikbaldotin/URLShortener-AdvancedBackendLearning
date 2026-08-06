import { AuthRepository } from "./auth.repository.js";
import { AuthService } from "./auth.service.js";

const authREpository = new AuthRepository();
const authService = new AuthService(authREpository);

export default authService;
