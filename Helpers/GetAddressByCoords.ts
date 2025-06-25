export const getAddressByCoords = async (lat: number, lon: number) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.display_name) {
            return data.display_name;
        } else {
            console.error("❌ Dirección no encontrada");
            return null;
        }
    } catch (error) {
        console.error("❌ Error al obtener la dirección:", error);
        return null;
    }
}