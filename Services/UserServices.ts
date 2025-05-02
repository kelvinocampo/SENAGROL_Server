import UserRepository from "../Repositories/UserRepository";
import User from "../Dto/User/UserDto";
import generateHash from "../Helpers/generateHash";
import Login from "../Dto/User/LoginDto";
import generateToken from "../Helpers/generateToken";
import bcrypt from "bcryptjs";
import BuyerRepository from "../Repositories/BuyerRepository";

class UserService {

    static async register(user: User) {
        user.password = await generateHash(user.password);

        const id_user = await UserRepository.add(user);
        const registerBuyer = await BuyerRepository.add(id_user)

        return { success: true, status: "Usuario registrado" };
    }

    static async getByID(id: number) {
        return await UserRepository.getByID(id);
    }

    static async getAll() {
        return await UserRepository.getAll();
    }

    static async UpdatePassword(password: string, id_user: number) {
        password = await generateHash(password);
        return await UserRepository.UpdatePassword(password, id_user);
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

        const userRoles = await UserRepository.getUserRoles(foundUser.id_usuario);

        const SECRET_KEY = process.env.KEY_TOKEN;
        if (!SECRET_KEY) {
            throw new Error("La clave KEY_TOKEN no está definida.");
        }

        const accessToken = generateToken({ id: foundUser.id_usuario, roles: userRoles }, SECRET_KEY, 60);
        const refreshToken = generateToken({ id: foundUser.id_usuario, roles: userRoles }, SECRET_KEY, 60 * 24 * 7);

        return { logged: true, status: "Login exitoso", accessToken: accessToken, refreshToken: refreshToken };
    }

    static async updateUserProfile(id: number, updatedData: User) {
        const user = await UserRepository.getByID(id);

        if (!user) {
            return { success: false, status: "Usuario no encontrado" };
        }

        const updatedUser = await UserRepository.update(id, updatedData);

        return { success: true, status: "Perfil actualizado correctamente", user: updatedUser };
    }
}

export default UserService;
