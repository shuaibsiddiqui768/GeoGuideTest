import { useParams } from "react-router-dom";
import styles from "./City.module.css";
import { useEffect } from "react";
import { useCities } from "../contexts/CitiesContext";
import Spinner from "../components/Spinner";
import BackButton from "./BackButton";

const formatDate = (date) => {
  if (!date) return "Unknown date";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "Invalid date";
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(d);
};


  useEffect(() => {
  if (id) getCity(id);
}, [id, getCity]);



  if (isLoading || !currentCity) return <Spinner />;

  // If backend uses json-server-style fields:
  const { cityName, emoji, date, notes } = currentCity;

  // If backend uses new fields (name/dateVisited/message), switch to:
  // const { name: cityName, emoji, dateVisited: date, message: notes } = currentCity;

  return (
    <div className={styles.city}>
      <div className={styles.row}>
        <h6>City name</h6>
        <h3>
          <span className={styles.emoji}>{emoji}</span> {cityName}
        </h3>
      </div>

      <div className={styles.row}>
        <h6>You went to {cityName} on</h6>
        <p>{formatDate(date)}</p>
      </div>

      {notes && (
        <div className={styles.row}>
          <h6>Your notes</h6>
          <p>{notes}</p>
        </div>
      )}

      <div className={styles.row}>
        <h6>Learn more</h6>
        <a
          href={`https://en.wikipedia.org/wiki/${encodeURIComponent(cityName)}`}
          target="_blank"
          rel="noreferrer"
        >
          Check out {cityName} on Wikipedia &rarr;
        </a>
      </div>

      <div>
        <BackButton />
      </div>
    </div>
  );
}

export default City;


