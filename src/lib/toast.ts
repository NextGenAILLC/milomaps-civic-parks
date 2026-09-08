export function toast(message: string) {
  window.dispatchEvent(new CustomEvent("milo-toast", { detail: message }));
}
