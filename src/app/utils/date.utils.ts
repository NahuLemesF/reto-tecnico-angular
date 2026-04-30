export function calculateRevisionDate(releaseDateStr: string): string {
  if (!releaseDateStr) {
    return '';
  }

  const [year, month, day] = releaseDateStr.split('-').map(Number);
  const releaseDate = new Date(year, month - 1, day);
  
  releaseDate.setFullYear(releaseDate.getFullYear() + 1);
  
  const nextYear = releaseDate.getFullYear();
  const nextMonth = String(releaseDate.getMonth() + 1).padStart(2, '0');
  const nextDay = String(releaseDate.getDate()).padStart(2, '0');
  
  return `${nextYear}-${nextMonth}-${nextDay}`;
}
