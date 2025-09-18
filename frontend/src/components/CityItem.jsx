import { Link } from "react-router-dom";
import styles from "./CityItem.module.css";
import { useCities } from "../contexts/CitiesContext";

const formatDate = (date) => {
  if (!date) return "Unknown date";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "Invalid date";
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
};

function CityItem({ city }) {
  const { currentCity, deleteCity } = useCities();
  // If backend kept json-server field names:
  const { cityName, emoji, date, _id, position } = city;

  // If backend uses new names, map instead:
  // const { name: cityName, emoji, dateVisited: date, _id, position } = city;

  function handleClick(e) {
    e.preventDefault(); // avoid following the Link when deleting [web:62]
    e.stopPropagation();
    deleteCity(_id);
  }

  return (
    <li>
      <Link
        className={`${styles.cityItem} ${
          currentCity?._id === _id ? styles["cityItem--active"] : ""
        }`}
        to={`${_id}?lat=${position.lat}&lng=${position.lng}`}
      >
        <span className={styles.emoji}>{emoji}</span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>({formatDate(date)})</time>
        <button className={styles.deleteBtn} onClick={handleClick}>
          &times;
        </button>
      </Link>
    </li>
  );
}

export default CityItem;
