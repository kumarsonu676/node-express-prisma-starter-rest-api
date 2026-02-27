export interface CountryDto {
  name: string;
  code: string;
  codeIso3: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface CountryListResponse {
  countries: CountryDto[];
  total: number;
}
