class Products   {
  //  private _Token: string;
    private _userId: number;
    private _Nombre: string;
    private _Precio: number;
    private _Description: string;
    private _latitud: number;
    private _longitud: number;
    private _quantity: number;
    private _MinimumQuantity: number;
    private _imagen: string;
    private _Discount: number;
    
    constructor( userId: number, Nombre: string, Precio: number, Description: string,latitud: number,longitud:number, quantity: number, MinimumQuantity: number,  imagen: string, Discount: number) {
       // this._Token = Token;
        this._userId = userId;
        this._Nombre = Nombre;
        this._Precio = Precio;
        this._Description = Description;
        this._quantity = quantity;
        this._MinimumQuantity = MinimumQuantity;
        this._latitud =latitud;
        this._longitud = longitud;
        this._imagen = imagen;
        this._Discount = Discount;
     }
/* 
     get Token(): string {
        return this._Token;
     } */
        get userId(): number {
         return this._userId;
     }

     get Nombre(): string {
        return this._Nombre;
     }
    
     get Precio(): number {
        return this._Precio;
     }

     get Description(): string {
        return this._Description;
     }

     get latitud(): number {
      return this._latitud;
     }
     get longitud(): number {
      return this._longitud;
     }

     get quantity(): number {
        return this._quantity;
     }

     get MinimumQuantity(): number {
        return this._MinimumQuantity;
     }

     get imagen(): string {
        return this._imagen;
     }

     get Discount(): number {
        return this._Discount;
     }

    /*  set Token(Token: string) {
        this._Token = Token;
     } */
     set userId(userId: number) {
        this._userId = userId;
     }

     set Nombre(Nombre: string) {
        this._Nombre = Nombre;
     }
     set Precio(Precio: number) {
        this._Precio = Precio;
     }
     set Description(Description: string) {
        this._Description = Description;
     }

     set latitud(latitud: number) {
      this._latitud = latitud;
     }

     set longitud(longitud: number) {
      this._longitud = longitud;
     }
     set quantity(quantity: number) {
        this._quantity = quantity;
     }
     set MinimumQuantity(MinimumQuantity: number) {
        this._MinimumQuantity = MinimumQuantity;
     }
    
     set imagen(imagen: string) {
        this._imagen = imagen;
     }
     set Discount(Discount: number) {
        this._Discount = Discount;
     }

    }
export default Products;
    