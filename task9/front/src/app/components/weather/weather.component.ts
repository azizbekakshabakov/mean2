import { Component } from '@angular/core';
import { WeatherService } from '../../services/weather-service/weather.service';
import {cities} from './cities';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.css'
})
export class WeatherComponent {
  cities: any = cities;
  city: any = '';
  cityInfo: any;

  constructor(
    private weatherService: WeatherService) {}

  ngOnInit(): void {
    if (this.city) {
      this.getCity();
    }
  }

  getCity(): void {
    this.weatherService.getCity(this.city).subscribe(cityInfo => {
      this.cityInfo = cityInfo;

      console.log(cityInfo);
    });
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
