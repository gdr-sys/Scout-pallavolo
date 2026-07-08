/**
 * Trigger haptic feedback (vibration) if supported.
 * Duration in ms (default: 30ms for light tap).
 */
export function triggerHaptic(duration: number = 30) {
  if ('vibrate' in navigator) {
    navigator.vibrate(duration);
  }
}

export function triggerHapticPattern(pattern: number[]) {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
}
