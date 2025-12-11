// 1. Facilities (Bitwise Flags)
export const facilitiesMap = {
  1: "Professional Lighting",
  2: "Changing Rooms",
  4: "Showers",
  8: "Secure Parking",
  16: "Ball Rental",
  32: "Spectator Seating"
};

// 2. Sport Type
export const sportTypeMap = { 
  0: "Soccer", 
  1: "Basketball", 
  2: "Tennis",
  3: "Padel",
  4: "Volleyball"
}; 

// 3. Field Status
export const fieldStatusMap = { 
  0: "Excellent", 
  1: "Good", 
  2: "Fair", 
  3: "Poor" 
};

// Helper: Decodes a bitwise integer into an array of text labels
export const getFacilitiesList = (bitmask) => {
  if (!bitmask || bitmask === 0) return [];
  const selectedFacilities = [];
  Object.keys(facilitiesMap).forEach((key) => {
    const value = parseInt(key);
    if ((bitmask & value) === value) {
      selectedFacilities.push(facilitiesMap[value]);
    }
  });
  return selectedFacilities;
};