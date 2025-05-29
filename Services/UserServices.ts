import UserRepository from "../Repositories/UserRepository";
import User from "../Dto/User/UserDto";
import generateHash from "../Helpers/generateHash";
import Login from "../Dto/User/LoginDto";
import generateToken from "../Helpers/generateToken";
import bcrypt from "bcryptjs";
import BuyerRepository from "../Repositories/BuyerRepository";
import jwt, { JwtPayload } from "jsonwebtoken";
import TransporterDto from "../Dto/User/TransporterDto";
import TransporterRepository from "../Repositories/TransporterRepository";
import { DataEmail, sendResetEmail } from "../Helpers/SendResetEmail";

const SECRET_KEY = process.env.KEY_TOKEN;

class UserService {
    static async register(user: User) {
        user.password = await generateHash(user.password);

        const id_user = await UserRepository.add(user);
        const registerBuyer = await BuyerRepository.add(id_user)

        return { success: true, status: "Usuario registrado" };
    }

    static async getByID(id: number) {
        const roles = await UserRepository.getUserRoles(id);
        const user = await UserRepository.getByID(id);
        if (!user) {
            return null;
        }
        let userWithRoles = {
            ...user,
            roles: roles,
        };
        if (roles.includes("transportador")) {
            const getDataTransporter: any = await TransporterRepository.getById(id)
            if (getDataTransporter.length > 0) {
                const dataTransporter = getDataTransporter[0];
                userWithRoles = { ...userWithRoles, ...dataTransporter }
            }
        }
        return userWithRoles;
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

        if (!SECRET_KEY) {
            throw new Error("La clave KEY_TOKEN no está definida.");
        }

        const accessToken = generateToken({ id: foundUser.id_usuario, roles: userRoles }, SECRET_KEY, 60 * 24);
        const refreshToken = generateToken({ id: foundUser.id_usuario, roles: userRoles }, SECRET_KEY, 60 * 24 * 7);

        return { logged: true, status: "Login exitoso", accessToken: accessToken, refreshToken: refreshToken };
    }

    static async refreshAccessToken(refreshToken: string) {
        const SECRET_KEY = process.env.KEY_TOKEN;
        if (!SECRET_KEY) {
            throw new Error("La clave KEY_TOKEN no está definida.");
        }

        const decoded = jwt.verify(refreshToken, process.env.KEY_TOKEN as string) as JwtPayload
        const { id, roles } = decoded.data;


        const accessToken = generateToken({ id: id, roles: roles }, SECRET_KEY, 60);

        return { logged: true, status: "Login exitoso", accessToken: accessToken };
    }

    static async updateUserProfile(id: number, updatedData: User, dataTransporter: TransporterDto) {
        const user = await UserRepository.getByID(id);

        if (!user) {
            return { success: false, status: "Usuario no encontrado" };
        }

        const updatedUser = await UserRepository.update(id, updatedData);
        const roles = await UserRepository.getUserRoles(id)
        if (roles.includes("transportador")) {
            const updatedTransporter = await TransporterRepository.update(dataTransporter);
        }

        return { success: true, status: "Perfil actualizado correctamente", user: updatedUser };
    }

    static async recoverUser(email: string) {
        const result: any = await UserRepository.getByEmail(email)
        if (result.length === 0) {
            return { code: 400, success: false, message: "Usuario no encontrado" }
        }
        const [user] = result
        const roles = await UserRepository.getUserRoles(user.id_usuario)
        const token = generateToken({ id: user.id_usuario, roles: roles }, SECRET_KEY, 60)
        const dataEmail: DataEmail = { email: user.correo, token: token }

        const sendEmail = await sendResetEmail(dataEmail);

        if(!sendEmail){
        return { code: 500, success: false, message: "Correo no enviado." }
        }

        return { code: 200, success: true, message: "Correo enviado correctamente." }
    }
}

export default UserService;
