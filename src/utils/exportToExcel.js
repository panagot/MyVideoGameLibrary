import * as XLSX from 'xlsx'

export const exportCollectionToExcel = (games, consoles, username) => {
  // Prepare games data
  const gamesData = games.map(game => ({
    'Title': game.title,
    'Platform': game.console,
    'Release Date': game.releaseDate || '',
    'Condition': game.condition ? game.condition.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) : '',
    'Notes': game.notes || ''
  }))

  // Prepare consoles data
  const consolesData = consoles.map(consoleItem => ({
    'Name': consoleItem.name,
    'Manufacturer': consoleItem.manufacturer,
    'Release Date': consoleItem.releaseDate || '',
    'Condition': consoleItem.condition ? consoleItem.condition.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) : '',
    'Notes': consoleItem.notes || ''
  }))

  // Create a new workbook
  const workbook = XLSX.utils.book_new()

  // Create worksheets
  if (gamesData.length > 0) {
    const gamesSheet = XLSX.utils.json_to_sheet(gamesData)
    // Set column widths
    gamesSheet['!cols'] = [
      { wch: 35 }, // Title
      { wch: 20 }, // Platform
      { wch: 15 }, // Release Date
      { wch: 15 }, // Condition
      { wch: 40 }  // Notes
    ]
    XLSX.utils.book_append_sheet(workbook, gamesSheet, 'Games')
  }

  if (consolesData.length > 0) {
    const consolesSheet = XLSX.utils.json_to_sheet(consolesData)
    // Set column widths
    consolesSheet['!cols'] = [
      { wch: 30 }, // Name
      { wch: 20 }, // Manufacturer
      { wch: 15 }, // Release Date
      { wch: 15 }, // Condition
      { wch: 40 }  // Notes
    ]
    XLSX.utils.book_append_sheet(workbook, consolesSheet, 'Consoles')
  }

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().split('T')[0]
  const filename = `${username || 'Collection'}_${timestamp}.xlsx`

  // Write the file
  XLSX.writeFile(workbook, filename)
}

