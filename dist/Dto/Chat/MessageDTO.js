"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Message {
    // Constructor
    constructor(editado, tipo, contenido, fecha_envio, id_chat, id_user) {
        this._editado = editado;
        this._tipo = tipo;
        this._contenido = contenido;
        this._fecha_envio = fecha_envio;
        this._id_chat = id_chat;
        this._id_user = id_user;
    }
    // Getters y Setters
    // editado
    get editado() {
        return this._editado;
    }
    set editado(value) {
        this._editado = value;
    }
    // tipo
    get tipo() {
        return this._tipo;
    }
    set tipo(value) {
        this._tipo = value;
    }
    // contenido
    get contenido() {
        return this._contenido;
    }
    set contenido(value) {
        this._contenido = value;
    }
    // fecha_envio
    get fecha_envio() {
        return this._fecha_envio;
    }
    set fecha_envio(value) {
        this._fecha_envio = value;
    }
    // id_chat
    get id_chat() {
        return this._id_chat;
    }
    set id_chat(value) {
        this._id_chat = value;
    }
    // id_user
    get id_user() {
        return this._id_user;
    }
    set id_user(value) {
        this._id_user = value;
    }
}
exports.default = Message;
