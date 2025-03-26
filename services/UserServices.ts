import UserRepository from '../repositories/UserRepository';
import User from '../Dto/User/UserDto';
import generateHash from '../Helpers/generateHash';
import Login from '../Dto/User/LoginDto';
import generateToken from '../Helpers/generateToken';
import bcrypt from 'bcrypt';


class UserService {
    static async register(user: User) {
        user.password = await generateHash(user.password);
        return await UserRepository.add(user);
    }
    static async getByID(id:number) {
        return await UserRepository.getByID(id);
    }
    
    static async logIn(user: Login) {
        const foundUser = await UserRepository.findByEmailOrUsername(user.identifier);
       
        if (!foundUser) {
            return { logged: false, status: "Usuario o contraseña incorrectos" };
        }

        const isPasswordValid = await bcrypt.compare(user.password, foundUser.contraseña);
        if (!isPasswordValid) {
            return { logged: false, status: "Usuario o contraseña incorrectos" };
        }

        // Obtener roles del usuario
        const userRoles = await UserRepository.getUserRoles(foundUser.id_usuario);

        const TOKEN_DURATION = 60; 
        const token = generateToken({ id: foundUser.id_usuario, roles: userRoles }, process.env.KEY_TOKEN, TOKEN_DURATION);

        return { logged: true, status: "Login exitoso", token, data: foundUser, roles: userRoles };
    }
}

export default UserService;