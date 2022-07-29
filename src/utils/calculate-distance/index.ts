export const calculateDistance = ({
  originLatitude,
  originLongitude,
  destinationLatitude,
  destinationLongitude,
}: {
  originLatitude: number,
  originLongitude: number,
  destinationLatitude: number,
  destinationLongitude: number
}): number => {
  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  const R = 6371;
  const dLat = deg2rad(destinationLatitude - originLatitude);
  const dLon = deg2rad(destinationLongitude - originLongitude);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
      + Math.cos(deg2rad(destinationLatitude)) * Math.cos(deg2rad(originLatitude))
      * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Number(distance.toFixed(2));
};
