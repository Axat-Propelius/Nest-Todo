import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { toNumber, trim } from "./cast.helper";

export class PaginationAndSearchDto {
    @Transform(({ value }) => toNumber(value, { default: 1, min: 1 }))
    @IsOptional()
    @IsNumber()
    @IsNotEmpty()
    page?: number;
  
    @Transform(({ value }) => toNumber(value, { default: 1, min: 1 }))
    @IsOptional()
    @IsNumber()
    @IsNotEmpty()
    limit?: number;
  
    @Transform(({ value }) => trim(value))
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    search?: string;
  }