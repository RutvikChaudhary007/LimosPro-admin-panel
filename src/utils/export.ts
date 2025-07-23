
/**
 * Export data to CSV file
 * @param filename Name of the file without extension
 * @param headers Array of column headers
 * @param rows Array of data rows (each row is an array of values)
 */
export const exportToCsv = (
  filename: string, 
  headers: string[], 
  rows: (string | number)[][]
) => {
  // Format the headers
  const headerRow = headers.join(',');
  
  // Format the data rows
  const csvRows = rows.map(row => 
    row.map(value => {
      // Handle values with commas by wrapping in quotes
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        // Escape quotes by doubling them
        const escaped = value.replace(/"/g, '""');
        return `"${escaped}"`;
      }
      return value;
    }).join(',')
  );
  
  // Combine headers and rows
  const csvContent = [headerRow, ...csvRows].join('\n');
  
  // Create a blob and download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  // Set up the download
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${getFormattedDate()}.csv`);
  link.style.visibility = 'hidden';
  
  // Append to the DOM, trigger the download, and clean up
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Get a formatted date string for file naming
 */
const getFormattedDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};
