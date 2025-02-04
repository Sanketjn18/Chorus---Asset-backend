import { IsString, IsNumber, IsISO8601 } from 'class-validator';

export class BluetoothLogDto {
  @IsString()
  assetID: string;

  @IsNumber()
  RSSI: number;

  @IsISO8601()
  timestamp: string;
}
