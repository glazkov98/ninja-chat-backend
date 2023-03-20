import { ApiProperty } from '@nestjs/swagger';

export class LatLngDto {
  @ApiProperty({ type: Number })
  lat: number;
  @ApiProperty({ type: Number })
  lng: number;
}
