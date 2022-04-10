export const formatTime = (seconds: number) => {
    let hours = Math.floor(seconds / 60 / 60);
    let minutes = Math.floor((seconds - hours * 3600) / 60);
    let secs = Math.floor(seconds - hours * 3600 - minutes * 60);
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};
