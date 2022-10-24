# FCC: Show the Local Weather

**Objective**: Build an app that is functionally similar to this: https://codepen.io/freeCodeCamp/full/bELRjV.

**Rule #1**: Don't look at the example project's code. Figure it out for yourself.

**Rule #2**: Fulfill the below user stories and get all of the tests to pass. Use whichever libraries or APIs you need. Give it your own personal style.

**User Story**: I can see the weather in my current location.

**User Story**: I can see a different icon or background image (e.g. snowy mountain, hot desert) depending on the weather.

**User Story**: I can push a button to toggle between Fahrenheit and Celsius.

**Note**: Many internet browsers now require an HTTP Secure (https://) connection to obtain a user's locale via HTML5 Geolocation. For this reason, we recommend using HTML5 Geolocation to get user location and then use the freeCodeCamp Weather API https://weather-proxy.freecodecamp.rocks/ which uses an HTTP Secure connection for the weather. Also, be sure to connect to CodePen.io via https://.

When you are finished, include a link to your project on CodePen and click the "I've completed this challenge" button.

You can get feedback on your project by sharing it on the [freeCodeCamp forum](https://forum.freecodecamp.org/c/project-feedback/409).


**Solution Link: https://bit.ly/3z76aG7**

---

# Folder Structure

```sh
public/
├─ img/
│  ├─ clear.svg
│  ├─ clouds.svg
│  ├─ rain.svg
│  ├─ snow.svg
│  ├─ thunderstom.svg
├─ index.html
├─ favicon.ico
src/
├─ App.css
├─ App.js
├─ index.js
.gitignore
package-lock.json
package.json
```
# Steps to complete the project

## Step 1: Set states of the coordinates (**coord**), dummy data (**dummy**), temperate unit (**unit**) as well as useRef to avoid unneccessary re-rendering

```js
    const [coord, setCoord] = React.useState([]);
    const [dummy, setDummy] = React.useState({});
    const [unit, setUnit] = React.useState("C");
    const useRef = React.useRef(0);
```

## Step 2: Fetch data from freecodecamp weater api

```sh
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
```

## Step 3. Use **useEffect** to call the function **navigator.geolocation** to obtaint the coordinates (**coord**) of the current location and fetch data with the function **fetchData**

```js
    React.useEffect(() => {
        if (typeof coord[0] === "undefined") {
            navigator.geolocation.getCurrentPosition((position) => {
                setCoord([position.coords.latitude, position.coords.longitude]);
                useRef.current += 1;
            });
        }
        fetchData(coord);
    }, [coord]);
```

## Step 4. Create **Temperature** component to format the output of the temperature portion

```js
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
```

## Step 5. Create **Location** component to format the output of the location portion

```js
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
```

## Step 6. Calculate the temperature unit of **Celsius** to **Fahrenheit** with 2 decimal places

```js
    const switchToF = (num) => {
        return ((num * 9) / 5 + 32).toFixed(2);
    };
```

## Step 7. Switch the temperature unit of **Celsius** to **Fahrenheit** and vice versa

```js
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
```

## Step 8. Return **App** function 

```js
    return useRef.current && Object.keys(dummy).length > 0 ? (
        <div className="App">
            <div className="banner">
                <img className="logo" src="https://design-style-guide.freecodecamp.org/downloads/fcc_secondary_small.svg" alt="freeCodeCamp" loading="lazy" /> 
                =&gt; Show Local Weather 
            </div>
            <Location />
            <Temperature />

            <button class="btn btn-primary" type="button" onClick={() => switchUnit(`${unit === "C" ? "F" : "C"}`)} >
                Switch to °{unit === "C" ? "F" : "C"}
            </button>
        </div>
    ) : (
        <div class="App">Browser not support geolocation</div>
    );
```
---

### Source Code

**App.js**

```js
import React from "react";
import "./App.css";

function App() {
    
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
                    <img className="icon" src={"img/" + temperature.main.toLowerCase() + ".svg"} alt={temperature.desc} loading="lazy" />
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
                    </span>
                        ---
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
                <img className="logo" src="https://design-style-guide.freecodecamp.org/downloads/fcc_secondary_small.svg" alt="freeCodeCamp" loading="lazy" /> 
                =&gt; Show Local Weather 
            </div>
            <Location />
            <Temperature />
            <button class="btn btn-primary" type="button" onClick={() => switchUnit(`${unit === "C" ? "F" : "C"}`)} >
                Switch to °{unit === "C" ? "F" : "C"}
            </button>
        </div>
    ) : (
        <div class="App">Browser not support geolocation</div>
    );
}

export default App;
```

**App.css**

```css
.App {
    text-align: center;
}

body {
    background-color: whitesmoke;
    font-size: 20px;
    font-weight: bold;
}

.banner {
  display: inline;
  /* justify-content: center; */
  justify-content: space-between;
  margin: auto;
}

.logo {
    /* align-items: center; */
    width: 50px;
}

.icon {
    margin: auto;
    width: 200px;
}

.location {
    font-size: 40px;
}
.figure1 {
    font-size: 35px;
}

.low {
    color: dodgerblue;
}

.high {
    color: indianred;
}

.desc,
.location {
    padding-top: 10px;
}

.btn {
    margin-top: 10px;
}
Footer
```
