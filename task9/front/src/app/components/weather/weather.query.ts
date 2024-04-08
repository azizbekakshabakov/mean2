import { Injectable } from '@angular/core';
import { gql, Query } from 'apollo-angular';

export interface MyData {
    generationtime_ms: string;
    timezone: string;
    daily: {
        time: [],
        weathercode: [],
        windspeed_10m_max: []
    }
}

export interface ByName {
    weather: MyData;
}

export const MyQuery = gql`
    query ExampleQuery($name: String!) {
        getWeather(name: $name) {
            generationtime_ms
            timezone
            daily {
                time,
                weathercode,
                windspeed_10m_max
            }
        }
    }  
  `;