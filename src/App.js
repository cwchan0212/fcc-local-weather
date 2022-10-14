import React from "react";
import "./App.css";

// https://weather-proxy.freecodecamp.rocks/api/current?lat=53.483959&lon=-2.244644
// https://codemyui.com/animated-weather-icons-in-css/
function App() {
    // const [count, setCount] = React.useState(0);
    const [coord, setCoord] = React.useState([]);
    const [dummy, setDummy] = React.useState({});
    const [unit, setUnit] = React.useState("C");
    const useRef = React.useRef(0);

    const fetchData = async (coord) => {
        const [lat, lon] = coord;
        // console.log("data", lat, lon);

        const base = "https://weather-proxy.freecodecamp.rocks/api/current";
        const params = new URLSearchParams({
            lat: lat,
            lon: lon,
        });
        const uri = base + "?" + params.toString();
        // console.log("w len", Object.keys(weather).length)
        //
        if (lat && lon && Object.keys(dummy).length === 0) {
            const res = await fetch(uri);

            console.log("uri", uri);
            console.log(res.ok);
            const data = await res.json();
            setDummy(data);
        }
    };
    console.log("out", dummy);
    React.useEffect(() => {
        if (typeof coord[0] === "undefined") {
            navigator.geolocation.getCurrentPosition((position) => {
                setCoord([position.coords.latitude, position.coords.longitude]);
                console.log(coord);
                // setCount((oldValue) => oldValue + 1);
                useRef.current += 1;
            });
        }
        fetchData(coord);

    }, [coord]);
    console.log(useRef.current, coord);
    // if (!useRef.current) {
    //     fetchData();
    //     useRef.current = true;
    // }
    if (Object.keys(dummy).length > 0) {
        // console.log("weather.coord.lat", weather.coord.lat)
    }

    const Temperature = () => {
        const temperature = {
            date: new Date(dummy.dt * 1000).toISOString(),
            temp: unit === "C"? dummy.main.temp : switchToF(dummy.main.temp),
            feel: unit === "C"? dummy.main.feels_like : switchToF(dummy.main.feels_like),
            low: unit === "C"? dummy.main.temp_min : switchToF(dummy.main.temp_min),
            high: unit === "C"? dummy.main.temp_max : switchToF(dummy.main.temp_max),
            main: dummy.weather[0].main,
            desc: dummy.weather[0].description,
            icon: dummy.weather[0].icon,
        };

        return temperature ? (
            <div className="temperature">
                <div className="picture">{temperature.icon}</div>
                <div className="figure1">
                    Temperature {temperature.temp} °{unit} ( Feel Like:
                    {temperature.feel}) °{unit}
                </div>
                <div className="figure2">
                    Low {temperature.low} °{unit} --- High {temperature.low} °
                    {unit}
                </div>
                <div className="desc">
                    {temperature.main} - {temperature.desc}
                </div>
                <div className="date">{temperature.date}</div>
            </div>
        ) : (
            <></>
        );
    };

    const Location = () => {
        const location = {
            lat: dummy.coord.lat,
            lon: dummy.coord.lon,
            city: dummy.name,
            country: dummy.sys.country,
        };

        return location ? (
            <div className="location">
                <div className="name">
                    {location.city}, {location.country}
                </div>
                <div className="position">
                    [{location.lat}, {location.lon}]
                </div>
            </div>
        ) : (
            <></>
        );
    };

    const switchToF = (num) => {
        return ((num * 9) / 5 + 32).toFixed(2)
    };

    const switchUnit = (unit) => {
        console.log(unit);
        let temp = dummy.main.temp;
        if (unit === "F") {
            setUnit(unit);
            temp = switchToF(temp);
            // fetchData(coord);
        } else {
            setUnit(unit);
            temp = dummy.main.temp;
        }
        console.log("je", unit, temp);
    };

    return useRef.current && Object.keys(dummy).length > 0 ? (
        <div className="App">
            {/* <div className="location">
                {JSON.stringify(dummy)}
                <br />
                <br />
                {useRef.current},

            </div> */}
            <Temperature />
            <Location />
            <button
                type="button"
                onClick={() => switchUnit(`${unit === "C" ? "F" : "C"}`)}
            >
                Switch to {unit === "C" ? "F" : "C"}
            </button>
        </div>
    ) : (
        <>Browser not support geolocation</>
    );
}

export default App;
