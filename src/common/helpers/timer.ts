export const timeToString = (time: number) =>
  time < 10 ? '0' + time : `${time}`;

export const getSecsDiffFromNow = (timestamp: number) =>
  Math.ceil((timestamp - +new Date()) / 1000);

export const getRemainingMinutes = (totalSecs: number) =>
  Math.trunc(totalSecs / 60);

export const getRemainingSeconds = (totalSecs: number, minutes: number) =>
  totalSecs - minutes * 60;

export const getRemainingTime = (timestamp: number) => {
  const totalSecs = getSecsDiffFromNow(timestamp);
  const minutes = getRemainingMinutes(totalSecs);
  const seconds = getRemainingSeconds(totalSecs, minutes);

  return {
    minutes: timeToString(minutes),
    seconds: timeToString(seconds),
  };
};
