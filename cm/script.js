// Switch between views
const byDateButton = document.getElementById('by-date');
const byComposerButton = document.getElementById('by-composer');

// Load CSV data
const csvFilePath = 'concerts.csv';
const csvDelimiter = ';';

const loadCSVData = async (csvFilePath, csvDelimiter) => {
  const response = await fetch(csvFilePath);
  const text = await response.text();
  const data = text.trim().split('\n').slice(1).map(row => row.split(csvDelimiter));
  return data;
}


let concertsData = [];

loadCSVData(csvFilePath, csvDelimiter)
  .then(data => {
    concertsData = data;
    renderByDate();
    // add button event listeners after data has been loaded
    Promise.all([
      byDateButton.addEventListener('click', () => {
        byDateButton.classList.add('active');
        byComposerButton.classList.remove('active');
        renderByDate();
      }),
      byComposerButton.addEventListener('click', () => {
        byDateButton.classList.remove('active');
        byComposerButton.classList.add('active');
        renderByComposer();
      })
    ]).catch(err => {
      console.error(err);
    });
  })
  .catch(err => {
    console.error(err);
  });


// Render view by date
const renderByDate = () => {
    const container = document.getElementById('concerts-container');
    container.innerHTML = '';
  
    const concertsByDate = {};
  
    for (const [date, composer, piece] of concertsData) {
      if (!concertsByDate[date]) {
        concertsByDate[date] = [];
      }
      concertsByDate[date].push({ composer, piece });
    }
  
    const decades = {}; // Group dates by decade
    for (const date in concertsByDate) {
      const year = parseInt(date.slice(-4));
      const decade = Math.floor(year / 10) * 10;
      if (!decades[decade]) {
        decades[decade] = [];
      }
      decades[decade].push({ date, concerts: concertsByDate[date] });
    }
  
    // Sort keys of decades object in descending order
    const sortedDecades = Object.keys(decades).sort((a, b) => b - a);
  
    // Iterate through sorted decades keys
    for (const decade of sortedDecades) {
      const decadeContainer = document.createElement('div');
      decadeContainer.className = 'decade';
      const decadeHeader = document.createElement('div');
      decadeHeader.className = 'decade-header';
      decadeHeader.textContent = `${decade}s`;
      decadeHeader.onclick = () => {
        decadeHeader.classList.toggle('active');
        const collapsible = decadeHeader.nextElementSibling;
        collapsible.classList.toggle('active');
      };
      decadeContainer.appendChild(decadeHeader);
  
      const collapsible = document.createElement('div');
      collapsible.className = 'collapsible';
      for (const { date, concerts } of decades[decade]) {
        const dateContainer = document.createElement('div');
        dateContainer.className = 'concert-date';
        dateContainer.textContent = date;
        dateContainer.onclick = () => {
          dateContainer.classList.toggle('active');
          const collapsibleItem = dateContainer.nextElementSibling;
          collapsibleItem.classList.toggle('active');
        };
        collapsible.appendChild(dateContainer);
  
        const collapsibleItem = document.createElement('div');
        collapsibleItem.className = 'collapsible-item';
        for (const { composer, piece } of concerts) {
          const composerContainer = document.createElement('div');
          composerContainer.className = 'composer';
          composerContainer.textContent = composer;
          composerContainer.onclick = () => {
            composerContainer.classList.toggle('active');
            const pieceItem = composerContainer.nextElementSibling;
            pieceItem.classList.toggle('active');
          };
          collapsibleItem.appendChild(composerContainer);
  
          const pieceItem = document.createElement('div');
          pieceItem.className = 'piece';
          pieceItem.textContent = piece;
          composerContainer.insertAdjacentElement('afterend', pieceItem);
        }
        dateContainer.insertAdjacentElement('afterend', collapsibleItem);
      }
      decadeContainer.appendChild(collapsible);
      container.appendChild(decadeContainer);
    }
  };
  

// Render view grouped by composer and piece
const renderByComposer = () => {
    const composerPieces = {};
    concertsData.forEach((concert) => {
      if (!composerPieces[concert[1]]) {
        composerPieces[concert[1]] = {};
      }
      if (!composerPieces[concert[1]][concert[2]]) {
        composerPieces[concert[1]][concert[2]] = [];
      }
      composerPieces[concert[1]][concert[2]].push(concert[0]);
    });
  
    const container = document.getElementById('concerts-container');
    container.innerHTML = "";
  
    // Get the sorted list of composers
    const sortedComposers = Object.keys(composerPieces).sort((a, b) => {
      // Extract the surname from the composer name
      const surnameA = a.split(' ').pop();
      const surnameB = b.split(' ').pop();
      // Compare the surnames
      return surnameA.localeCompare(surnameB);
    });
  
    // Render the tables in alphabetical order by surname
    sortedComposers.forEach((composer) => {
      const composerTable = document.createElement("table");
      composerTable.classList.add("composer-table");
      const composerHeading = document.createElement("h2");
      composerHeading.textContent = composer;
      container.appendChild(composerHeading);
      container.appendChild(composerTable);
  
      const thead = document.createElement("thead");
      const headerRow = document.createElement("tr");
      const pieceHeader = document.createElement("th");
      pieceHeader.textContent = "Piece";
      const dateHeader = document.createElement("th");
      dateHeader.textContent = "Date";
      headerRow.appendChild(pieceHeader);
      headerRow.appendChild(dateHeader);
      thead.appendChild(headerRow);
      composerTable.appendChild(thead);
  
      for (const piece in composerPieces[composer]) {
        const dateList = composerPieces[composer][piece];
        const row = document.createElement("tr");
        const pieceCell = document.createElement("td");
        pieceCell.textContent = piece;
        const dateCell = document.createElement("td");
        dateCell.textContent = dateList.join(", ");
        row.appendChild(pieceCell);
        row.appendChild(dateCell);
        composerTable.appendChild(row);
      }
    });
  };
  

  
  
