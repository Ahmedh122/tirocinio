function isValidDate(day: string, month: string, year: string) {
  const dayNum = Number.parseInt(day, 10);
  const monthNum = Number.parseInt(month, 10);
  const yearNum = Number.parseInt(year, 10);

  if (monthNum < 1 || monthNum > 12 || dayNum < 1 || dayNum > 31) {
    return false;
  }

  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (monthNum === 2 && ((yearNum % 4 === 0 && yearNum % 100 !== 0) || yearNum % 400 === 0)) {
    if (dayNum > 29) return false;
  } else if (dayNum > daysInMonth[monthNum - 1]) {
    return false;
  }

  return true;
}

// converte la data nel formato YYYY-MM-DD per il TextField type='date'

function parseToIsoDate(dateString: string) {
  if (!dateString) {
    return '';
  }

  let [day, month, year] = ['', '', ''];
  if (dateString.includes('/')) {
    [day, month, year] = dateString.split('/');
  } else if (dateString.length === 8) {
    day = dateString.substring(0, 2);
    month = dateString.substring(2, 4);
    year = dateString.substring(4, 8);
  } else if (dateString.length === 6) {
    day = dateString.substring(0, 2);
    month = dateString.substring(2, 4);
    year = `20${dateString.substring(4, 6)}`;
  } else {
    return '';
  }

  if (
    !day ||
    !month ||
    !year ||
    day.length !== 2 ||
    month.length !== 2 ||
    (year.length !== 2 && year.length !== 4)
  ) {
    return '';
  }

  const fullYear = year.length === 2 ? `20${year}` : year;

  if (!isValidDate(day, month, fullYear)) {
    return ''; // Invalid date values
  }

  return `${fullYear}-${month}-${day}`;
}

// Converte la data nel formato originale DD/MM/YYYY per essere inviata al server

function parseFromIsoDate(dateString: string) {
  if (!dateString) {
    return '';
  }
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}

function convertToLocaleString({
  dateISOString,
  locale = 'it',
}: {
  dateISOString: string;
  locale?: string;
}): string {
  const date = new Date(dateISOString);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  };
  return date.toLocaleDateString(locale, options);
}

export { parseToIsoDate, parseFromIsoDate, convertToLocaleString };