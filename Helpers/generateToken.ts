import jwt from 'jsonwebtoken';

const timeToSeconds = (time: string | number): number => {
    if (typeof time === "number") return time * 1440; // Si es número, asumir minutos

    const unit = time.slice(-1);  // Último carácter
    const value = parseInt(time); // Número sin la unidad

    switch (unit) {
        case "m": return value * 60;       // Minutos
        case "h": return value * 3600;     // Horas
        case "d": return value * 86400;    // Días
        default: return value * 60;        // Por defecto, minutos
    }
};

let generateToken = (properties: any, key: any, duration: string | number) => 
    jwt.sign({
        exp: Math.floor(Date.now() / 1000) + timeToSeconds(duration),
        data: properties
    }, key);


export default generateToken;/* Este archivo es para generar el token */