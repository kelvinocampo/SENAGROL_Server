export const getAddressByCoords = async (lat: number, lon: number) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.display_name) {
            console.log("✅ Dirección completa:", data.display_name);
            console.log("📌 Desglose:", {
                calle: data.address.road || "No especificada",
                número: data.address.house_number || "N/A",
                ciudad: data.address.city || data.address.town,
                país: data.address.country,
                código_postal: data.address.postcode
            });
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