import React from "react";
import "./App.css";

// https://weather-proxy.freecodecamp.rocks/api/current?lat=53.483959&lon=-2.244644
// Weather Icons: https://github.com/Makin-Things/weather-icons
function App() {
    // const [count, setCount] = React.useState(0);
    const [coord, setCoord] = React.useState([]);
    const [dummy, setDummy] = React.useState({});
    const [unit, setUnit] = React.useState("C");
    const useRef = React.useRef(0);

    const fetchData = async (coord) => {
        const [lat, lon] = coord;
        const base = "https://weather-proxy.freecodecamp.rocks/api/current";
        const params = new URLSearchParams({
            lat: lat,
            lon: lon,
        });
        const uri = base + "?" + params.toString();

        if (lat && lon && Object.keys(dummy).length === 0) {
            const res = await fetch(uri);


            const data = await res.json();
            setDummy(data);
        }
    };

    React.useEffect(() => {
        if (typeof coord[0] === "undefined") {
            navigator.geolocation.getCurrentPosition((position) => {
                setCoord([position.coords.latitude, position.coords.longitude]);
                useRef.current += 1;
            });
        }
        fetchData(coord);
    }, [coord]);

    const Temperature = () => {
        const temperature = {
            date: new Date(dummy.dt * 1000).toISOString(),
            temp: unit === "C" ? dummy.main.temp : switchToF(dummy.main.temp),
            feel:
                unit === "C"
                    ? dummy.main.feels_like
                    : switchToF(dummy.main.feels_like),
            low:
                unit === "C"
                    ? dummy.main.temp_min
                    : switchToF(dummy.main.temp_min),
            high:
                unit === "C"
                    ? dummy.main.temp_max
                    : switchToF(dummy.main.temp_max),
            main: dummy.weather[0].main,
            desc: dummy.weather[0].description,
            icon: dummy.weather[0].icon,
        };

        return temperature ? (
            <div className="container">
                <div className="picture">
                    <img
                        className="icon"
                        src={"img/" + temperature.main.toLowerCase() + ".svg"}
                        alt={temperature.desc}
                        loading="lazy"
                    />
                </div>
                <div className="figure1">
                    Temperature {temperature.temp} °{unit}
                </div>
                <div className="figure2">
                    ( Feel Like {temperature.feel}) °{unit}
                </div>
                <div className="figure3">
                    <span class="low">
                        Low {temperature.low} °{unit}
                    </span>{" "}
                    ---{" "}
                    <span class="high">
                        High {temperature.high} °{unit}
                    </span>
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
        return ((num * 9) / 5 + 32).toFixed(2);
    };

    const switchUnit = (unit) => {

        let temp = dummy.main.temp;
        if (unit === "F") {
            setUnit(unit);
            temp = switchToF(temp);
            // fetchData(coord);
        } else {
            setUnit(unit);
            temp = dummy.main.temp;
        }
        return temp;
    };

    return useRef.current && Object.keys(dummy).length > 0 ? (
        <div className="App">
            <div className="banner">
                <img
                    className="logo"
                    src="https://design-style-guide.freecodecamp.org/downloads/fcc_secondary_small.svg"
                    alt="freeCodeCamp"
                    loading="lazy"
                /> =&gt; Show Local Weather 
            </div>
            <Location />
            <Temperature />

            <button
                class="btn btn-primary"
                type="button"
                onClick={() => switchUnit(`${unit === "C" ? "F" : "C"}`)}
            >
                Switch to °{unit === "C" ? "F" : "C"}
            </button>
        </div>
    ) : (
        <div class="App">Browser not support geolocation</div>
    );
}

export default App;
