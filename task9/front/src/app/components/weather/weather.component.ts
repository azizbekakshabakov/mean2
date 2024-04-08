import { Component, OnDestroy, OnInit } from '@angular/core';
import { WeatherService } from '../../services/weather-service/weather.service';
import {cities} from './cities';
import { Apollo, QueryRef, ApolloBase, gql } from 'apollo-angular';
// import { MyData, MyQuery, ByName } from './weather.query';
import { Observable, Subscription, map } from 'rxjs';
// import gql from 'graphql-tag';
import { WatchQueryOptions } from '@apollo/client/core';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.css'
})
export class WeatherComponent {
  cities: any = cities;
  city: any = '';
  cityInfo: any;

  posts: any;
  private querySubscription!: Subscription;

  constructor(
    private weatherService: WeatherService,
    private apollo: Apollo) {}

  ngOnInit(): void {
    if (this.city) {
      this.fetchWeather(this.city);
    }
  }

  fetchWeather(name: string) {
    this.apollo.query({
      query: gql`
        query GetWeather($name: String!) {
          getWeather(name: $name) {
            generationtime_ms
            timezone
            daily {
              time
              weathercode
              temperature_2m_max
              temperature_2m_min
              rain_sum
              snowfall_sum
              windspeed_10m_max
            }
          }
        }
      `,
      variables: {
        name: name
      }
    }).subscribe(result => {
      console.log(result.data);
      const data = result.data as any;
      this.cityInfo = data['getWeather'];
    });
  }

  getCity(): void {
    this.fetchWeather(this.city);
  }

  get_weather_icon_url(weather_code: any): string {
    if (weather_code < 2)
        return '/assets/img/svg/clear-sky.svg';
    else if (weather_code == 2)
        return '/assets/img/svg/partly-cloudly.svg';
    else if (weather_code == 3)
        return '/assets/img/svg/overcast.svg';
    else if (weather_code < 50)
        return '/assets/img/svg/fog.svg';
    else if (weather_code < 70)
        return '/assets/img/svg/rain.svg';
    else if (weather_code < 80)
        return '/assets/img/svg/snow.svg';
    else if (weather_code < 90)
        return '/assets/img/svg/rain-shower.svg';
    else
        return '/assets/img/svg/thunderstorm.svg';
  }
}
