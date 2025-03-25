class TransporterDto {
    private _userId: number;
    private _license: string;
    private _soat: string;
    private _vehicleCard: string;
    private _vehicleType: string;
    private _vehicleWeight: number;

    constructor(
        userId: number,
        license: string,
        soat: string,
        vehicleCard: string,
        vehicleType: string,
        vehicleWeight: number
    ) {
        this._userId = userId;
        this._license = license;
        this._soat = soat;
        this._vehicleCard = vehicleCard;
        this._vehicleType = vehicleType;
        this._vehicleWeight = vehicleWeight;
    }

    get userId(): number {
        return this._userId;
    }

    get license(): string {
        return this._license;
    }

    get soat(): string {
        return this._soat;
    }

    get vehicleCard(): string {
        return this._vehicleCard;
    }

    get vehicleType(): string {
        return this._vehicleType;
    }

    get vehicleWeight(): number {
        return this._vehicleWeight;
    }
}

export default TransporterDto;
