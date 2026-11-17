const rad = Math.PI / 180;

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export class Point {
  latitude: number;
  longitude: number;

  constructor(latitude: number, longitude: number) {
    this.latitude = latitude;
    this.longitude = longitude;
  }

  /** Haversine distance in km. */
  distance(latitude: number, longitude: number) {
    const h =
      Math.sin(((latitude - this.latitude) * rad) / 2) ** 2 +
      Math.cos(this.latitude * rad) *
        Math.cos(latitude * rad) *
        Math.sin(((longitude - this.longitude) * rad) / 2) ** 2;

    return 12_742 * Math.asin(Math.sqrt(h));
  }

  static of({ latitude, longitude }: Coordinates) {
    return new Point(latitude, longitude);
  }
}
