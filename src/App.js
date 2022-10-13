import React from "react";
import "./App.css";

// https://weather-proxy.freecodecamp.rocks/api/current?lat=53.483959&lon=-2.244644

function App() {
    const [location, setLocation] = React.useState({
        lat: 0,
        lon: 0,
        city: "",
        country: "",
    });
    const [count, setCount] = React.useState(0);

    const [temperature, setTemperature] = React.useState({
        date: "",
        temp: 0,
        feel: 0,
        low: 0,
        high: 0,
    });
    const useRef = React.useRef(false);

    const base = "https://weather-proxy.freecodecamp.rocks/api/current";

    // const lat = location.lat;
    // const lon = location.lon;
    

    const params = new URLSearchParams({
        lat: 53.483959,
        lon: -2.244644,
    });
    const uri = base + "?" + params.toString();

    // console.log("lat", params.get("lat"), params.get("lon"), typeof params.get("lon"), params.get("lon") === "undefined")

    const fetchData = async () => {
        if (
            params.get("lat") !== "undefined" &&
            params.get("lon") !== "undefined"
        ) {
            console.log(uri);
            const res = await fetch(uri);

            if (res.ok) {
                const data = await res.json();
                // console.log(data);


                setLocation({
                    lat: data.coord.lat,
                    lon: data.coord.lon,
                    city: data.name,
                    country: data.sys.country,
                });
                console.log(location.lat, location.lon);
                setTemperature({
                    date: new Date(data.dt * 1000).toString(),
                    temp: data.main.temp,
                    feel: data.main.feels_like,
                    low: data.main.temp_min,
                    high: data.main.temp_max,
                });
                console.log(
                    data.dt,
                    new Date(data.dt),
                    new Date(data.dt * 1000)
                );
                // console.log("sys", data.name, data.weather[0].icon, data.sys.country)
                // console.log("temp", data.main.feels_like, data.main.temp_min, data.main.temp_max)
            }
        }
        setCount((oldVal) => oldVal + 1);
    };
    // React.useEffect(() => {
    //     return () => {

    //     };
    // }, []);
    if (!useRef.current) {
        fetchData();
        useRef.current = true;
    }

    return count ? (
        <div className="App">
            Location: 
            {count}, {useRef.current}, Hello, {location.city},{" "}
            {location.country} , [{location.lat}, {location.lon}], <br/><br/>

             {temperature.date}, {temperature.temp}, {temperature.feel}, {temperature.low}, {temperature.high}

        </div>
    ) : (
        <></>
    );
}

export default App;
