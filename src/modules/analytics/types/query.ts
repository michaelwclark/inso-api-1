import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export function toBoolean(value: string): boolean {
  value = value.toLowerCase();
  return value === 'true' || value === '1' ? true : false;
}

export class AnalyticsQueryDto {
  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  @IsOptional()
  public chord: boolean;

  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  @IsOptional()
  public burst: boolean;

  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  @IsOptional()
  public directed: boolean;

  constructor(partial: Partial<AnalyticsQueryDto>) {
    if (partial && !partial.chord && !partial.burst && !partial.directed) {
      this.chord = true;
      this.burst = true;
      this.directed = true;
    } else if (partial) {
      this.chord = partial.chord ? partial.chord : false;
      this.burst = partial.burst ? partial.burst : false;
      this.directed = partial.directed ? partial.directed : false;
    }
  }
}
