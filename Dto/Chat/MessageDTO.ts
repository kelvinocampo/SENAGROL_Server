class Message {
    private _editado: boolean;
    private _tipo: 'texto' | 'audio' | 'imagen';
    private _contenido: string;
    private _fecha_envio: Date;
    private _id_chat: number;
    private _id_user: number;

    // Constructor
    constructor(
        editado: boolean,
        tipo: string,
        contenido: string,
        fecha_envio: Date,
        id_chat: number,
        id_user: number
    ) {
        this._editado = editado;
        this._tipo = tipo;
        this._contenido = contenido;
        this._fecha_envio = fecha_envio;
        this._id_chat = id_chat;
        this._id_user = id_user;
    }

    // Getters y Setters

    // editado
    get editado(): boolean {
        return this._editado;
    }

    set editado(value: boolean) {
        this._editado = value;
    }

    // tipo
    get tipo(): string {
        return this._tipo;
    }

    set tipo(value: string) {
        this._tipo = value;
    }

    // contenido
    get contenido(): string {
        return this._contenido;
    }

    set contenido(value: string) {
        this._contenido = value;
    }

    // fecha_envio
    get fecha_envio(): Date {
        return this._fecha_envio;
    }

    set fecha_envio(value: Date) {
        this._fecha_envio = value;
    }

    // id_chat
    get id_chat(): number {
        return this._id_chat;
    }

    set id_chat(value: number) {
        this._id_chat = value;
    }

    // id_user
    get id_user(): number {
        return this._id_user;
    }

    set id_user(value: number) {
        this._id_user = value;
    }
}

export default Message;