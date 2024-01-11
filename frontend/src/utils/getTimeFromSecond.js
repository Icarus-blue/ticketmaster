export const getTimeFromSecond = (num) => {
  let hour = Math.floor(num / 3600);
  let min =  Math.floor((num % 3600) / 60);
  if (hour < 10) hour = "0" + hour
  if (min < 10) min = "0" + min;
  return `${hour}:${min}`
}