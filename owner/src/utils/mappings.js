export const SportTypeMapping = {
  football: 0,
  padel: 4,
  tennis: 2,
};

export const SurfaceTypeMapping = {
  "Natural Grass": 1,
  "Artificial Turf (3G/4G)": 2,
  "Clay Court": 3,
  "Hard Court": 4,
};

export const FieldFormatMapping = {
  "5v5": 2,
  "7v7": 4,
  "9v9": 8,
  "11v11": 16,
  // "Tennis Singles": 4,
  // "Tennis Doubles": 5,
  // "Padel Standard": 6,
};

export const AmenitiesMapping = {
  lighting: 2, // ProfessionalLighting
  lockers: 4, // ChangingRooms
  showers: 8, // Showers
  parking: 16, // SecureParking
  balls: 32, // BallRental
  seating: 64, // SpectatorSeating
  // "wifi": 128,
  // "cafe": 256
};

export const CancellationMapping = {
  free_24h: 1,
  free_48h: 2,
  non_refundable: 3,
};

export const BookingWindowMapping = {
  "7_days": 1,
  "14_days": 2,
  "30_days": 3,
};
