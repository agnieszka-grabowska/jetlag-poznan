import toast from "react-hot-toast";

export function formatTime(ms: number, options: { showHours: boolean } = { showHours: false }) {
  const ss = Math.floor(ms / 1000) % 60;
  const mm = Math.floor(ms / 1000 / 60) % 60;
  const hh = Math.floor(ms / 1000 / 60 / 60);

  const formatedSeconds = ss.toString().padStart(2, "0");
  const formatedMinutes = mm.toString().padStart(2, "0");
  const formatedHours = hh.toString().padStart(2, "0");

  if (hh || options.showHours) {
    return `${formatedHours}:${formatedMinutes}:${formatedSeconds}`;
  }

  return `${formatedMinutes}:${formatedSeconds}`;
}

export const showToast = (error: any) => {
  if (error instanceof Error) {
    toast.error(error.message);
  } else if (error) {
    toast.error("Something went wrong!");
  }
};
