"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TransporterDto {
    constructor(userId, license, soat, vehicleCard, vehicleType, vehicleWeight) {
        this._userId = userId;
        this._license = license;
        this._soat = soat;
        this._vehicleCard = vehicleCard;
        this._vehicleType = vehicleType;
        this._vehicleWeight = vehicleWeight;
    }
    get userId() {
        return this._userId;
    }
    get license() {
        return this._license;
    }
    get soat() {
        return this._soat;
    }
    get vehicleCard() {
        return this._vehicleCard;
    }
    get vehicleType() {
        return this._vehicleType;
    }
    get vehicleWeight() {
        return this._vehicleWeight;
    }
}
exports.default = TransporterDto;
