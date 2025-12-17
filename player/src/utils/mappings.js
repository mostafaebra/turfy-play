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
    1: "Soccer", 
    2: "Basketball", 
    3: "Tennis",
    4: "Padel",
    5: "Volleyball"
  };
  
  // 3. Field Status
  export const fieldStatusMap = { 
    1: "Excellent", 
    2: "Good", 
    3: "Fair", 
    4: "Poor" 
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

