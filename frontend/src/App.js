import React        from "react";
import { observer } from 'mobx-react';
import UserStore    from './Stores/UserStore';
import LoginForm    from './LoginForm';
import SubmitButton from './components/SubmitButton';
import                   './App.css';
import Titles       from "./components/Titles";
import Form         from "./components/Form";
import Weather      from "./components/Weather";




const API_KEY = "938c0b043e3bf588186831606cc2990f";

class App extends React.Component {

    async componentDidMount() {

        try {

            var result = await fetch('/isLoggedIn', {
                method: 'post',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                }
            });

            var result = await res.json();

            if (result && result.success) {
              UserStore.loading = false;
              UserStore.isLoggedIn = true;
              UserStore.username = result.username;
            }

            else {
              UserStore.loading = false;
              UserStore.isLoggedIn = false;

            }

        }

        catch(e) {
          UserStore.loading = false;
          UserStore.isLoggedIn = false; 
        }
    }

    async doLogout() {

      try {

          var res = await fetch('/logout', {
              method: 'post',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
          });

          var result = await res.json();

          if (result && result.success) {
            UserStore.isLoggedIn = false;
            UserStore.username = '';
          }

      }

      catch(e) {
        console.log(e)
      }
  }

  state = {
    temperature: undefined,
    city: undefined,
    country: undefined,
    humidity: undefined,
    description: undefined,
    error: undefined
  }
  getWeather = async (e) => {
    e.preventDefault();
    const city = e.target.elements.city.value;
    const country = e.target.elements.country.value;
    const api_call = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${API_KEY}&units=imperial`);
    const data = await api_call.json();
    if (city && country) {
      this.setState({
        temperature: data.main.temp,
        city: data.name,
        country: data.sys.country,
        humidity: data.main.humidity,
        description: data.weather[0].description,
        error: ""
      });
    } else {
      this.setState({
        temperature: undefined,
        city: undefined,
        country: undefined,
        humidity: undefined,
        description: undefined,
        error: "Please enter the values."
      });
    }
  }
  render() {

      if (UserStore.loading) {
        return(
          <div className="app">
              <div className='container'>
                  Loading, please wait..
              </div>
          </div>
        );
      }

      else {

        if (UserStore.isLoggedIn) {
          return(
            <div className="app">
                <div className='container'>
                    Welcome {UserStore.username}

                    <SubmitButton
                      text={'Log out'}
                      disabled={false}
                      onClick={ () => this.doLogout() }
                    />
                </div>
            </div>
          );
        }

      }


    return (
      <div>
        <LoginForm />
        <div className="wrapper">
          <div className="main">
            <div className="col-xs-5 title-container">
                  <Titles />
            </div>
              <div className="col-xs-7 form-container">
                  <Form getWeather={this.getWeather} />
                  <Weather 
                    temperature={this.state.temperature} 
                    humidity={this.state.humidity}
                    city={this.state.city}
                    country={this.state.country}
                    description={this.state.description}
                    error={this.state.error}
                  />
              </div>
            </div>
        </div>
      </div>
    );
  }
};

export default observer(App);