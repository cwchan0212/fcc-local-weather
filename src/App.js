import React from "react";
import "./App.css";

// https://weather-proxy.freecodecamp.rocks/api/current?lat=53.483959&lon=-2.244644
// https://codemyui.com/animated-weather-icons-in-css/
function App() {
    const [location, setLocation] = React.useState({
        lat: -9999,
        lon: -9999,
        city: "",
        country: "",
    });
    const [count, setCount] = React.useState(0);
    const [weather, setWeather] = React.useState({
        main: "",
        desc: "",
        icon: "",
    });
    const [temperature, setTemperature] = React.useState({
        date: "",
        temp: 0,
        feel: 0,
        low: 0,
        high: 0,
    });
    const useRef = React.useRef(false);

    const fetchData = async () => {
        const base = "https://weather-proxy.freecodecamp.rocks/api/current";
        const params = new URLSearchParams({
            lat: location.lat || 22.302711,
            lon: location.lon || 114.177216,
        });
        const uri = base + "?" + params.toString();
        console.log("uri", uri);

        // if (
        //     params.get("lat") !== "undefined" &&
        //     params.get("lon") !== "undefined"
        // ) {
        console.log(uri);
        const res = await fetch(uri);

        if (res.ok) {
            const data = await res.json();
            console.log("data", data);
            location.city = data.name;
            location.country = data.sys.country;
            setLocation(location);
            console.log("location", location);

            setTemperature({
                date: new Date(data.dt * 1000).toISOString(),
                temp: data.main.temp,
                feel: data.main.feels_like,
                low: data.main.temp_min,
                high: data.main.temp_max,
            });

            // setWeather({...weather, weather: {
            //     main: data.weather[0].main,
            //     desc: data.weather[0].description,
            //     icon: data.weather[0].icon,
            // }})
            weather.main = data.weather[0].main;
            weather.desc = data.weather[0].description;
            weather.icon = data.weather[0].icon;
            setWeather(weather);
            console.log("weather", weather)
            console.log(data.dt, new Date(data.dt), new Date(data.dt * 1000));
            // console.log("sys", data.name, data.weather[0].icon, data.sys.country)
            // console.log("temp", data.main.feels_like, data.main.temp_min, data.main.temp_max)
            // }
        }
        setCount((oldVal) => oldVal + 1);
    };

    React.useEffect(() => {
        if (location)
            navigator.geolocation.getCurrentPosition((position) => {
                location.lat = position.coords.latitude;
                location.lon = position.coords.longitude;
                console.log("location in geo", location);

                if (!useRef.current) {
                    fetchData();
                    useRef.current = true;
                }
            });
    }, []);
    // if (!useRef.current) {
    //     fetchData();
    //     useRef.current = true;
    // }

    return count ? (
        <div className="App">
            Location:
            {count}, {useRef.current}, Hello, {location.city},{" "}
            {location.country} , [{location.lat}, {location.lon}], 
            <br />
            <br />
            {temperature.date}, {temperature.temp}, {temperature.feel},{" "}
            {temperature.low}, {temperature.high}
            <br />
            <br />
            {weather.main}, {weather.desc}, <img src={weather.icon}/>
        </div>
    ) : (
        <></>
    );
}

export default App;
