import { createContext, useContext, useEffect, useState } from "react";
// Use Express API base (adjust for prod via env if needed)
const BASE_URL = "http://localhost:5000/api";
const CitiesContext = createContext();
function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState(null);
  const [error, setError] = useState(null); // Safely parse JSON (avoids errors on empty body like 204)
  const parseJsonSafe = async (res) => {
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  }; // using safe text->JSON pattern for empty bodies [web:106][web:104]
  useEffect(() => {
    async function fetchCities() {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch(`${BASE_URL}/cities`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await parseJsonSafe(res);
        setCities(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        setError(e.message || "Failed to load cities");
        alert("There was an error while loading data..");
      } finally {
        setIsLoading(false);
      }
    }
    fetchCities();
  }, []);
  async function getCity(id) {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await parseJsonSafe(res);
      setCurrentCity(data);
    } catch (e) {
      console.error(e);
      setError(e.message || "Failed to load city");
      alert("There was an error while loading data..");
    } finally {
      setIsLoading(false);
    }
  }
  async function createCity(newCity) {
    try {
      setIsLoading(true);
      setError(null); // If date is a Date object, convert to ISO
      const payload = {
        ...newCity,
        date:
          newCity.date instanceof Date
            ? newCity.date.toISOString()
            : newCity.date, // If your backend expects normalized names, map here: // name: newCity.cityName, // dateVisited: newCity.date instanceof Date ? newCity.date.toISOString() : newCity.date, // message: newCity.notes, // position: { lat: Number(newCity.position.lat), lng: Number(newCity.position.lng) },
      };
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await parseJsonSafe(res);
      if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
      setCities((prev) => [...prev, data]);
      setCurrentCity(data);
    } catch (e) {
      console.error(e);
      setError(e.message || "Failed to create city");
      alert("There was an error creating city..");
    } finally {
      setIsLoading(false);
    }
  }
  async function deleteCity(id) {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch(`${BASE_URL}/cities/${id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) {
        const data = await parseJsonSafe(res);
        throw new Error(data?.message || `HTTP ${res.status}`);
      }
      setCities((prev) => prev.filter((city) => city._id !== id));
      setCurrentCity((c) => (c && c._id === id ? null : c));
    } catch (e) {
      console.error(e);
      setError(e.message || "Failed to delete city");
      alert("There was an error deleting city..");
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        error,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
            {children}   {" "}
    </CitiesContext.Provider>
  );
}
function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined) {
    throw new Error("CitiesContext was used outside the CitiesProvider");
  }
  return context;
}

export { CitiesProvider, useCities };
