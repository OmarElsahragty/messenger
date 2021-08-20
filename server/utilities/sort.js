const partition = (arr, getValue, start, end) => {
  const pivotValue = getValue(arr, end);
  let pivotIndex = start;
  for (let i = start; i < end; i++) {
    if (getValue(arr, i) > pivotValue) {
      [arr[i], arr[pivotIndex]] = [arr[pivotIndex], arr[i]];
      pivotIndex++;
    }
  }
  [arr[pivotIndex], arr[end]] = [arr[end], arr[pivotIndex]];
  return pivotIndex;
};

const quickSort = (arr, getValue, start, end) => {
  if (start >= end) return;
  const pivot = partition(arr, getValue, start, end);
  quickSort(arr, getValue, start, pivot - 1);
  quickSort(arr, getValue, pivot + 1, end);
};

module.exports = (arr, getValue = (arr, i) => arr[i]) =>
  quickSort(arr, getValue, 0, arr.length - 1);
