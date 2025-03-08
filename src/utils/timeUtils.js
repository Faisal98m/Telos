export const formatTime = (ms) => {
  if (ms < 0) return '00:00:00';
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${String(hours).padStart(4)}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};