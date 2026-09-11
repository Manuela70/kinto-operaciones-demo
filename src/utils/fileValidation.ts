export function isValidFileType(fileName: string, acceptedExtension: '.pdf' | '.jpg'): boolean {
  const ext = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
  return ext === acceptedExtension;
}

export function canAddMoreFiles(currentCount: number, maxFiles: number): boolean {
  return currentCount < maxFiles;
}
