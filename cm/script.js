// Load CSV data
const csvFilePath = 'concerts.csv';
const csvDelimiter = ',';

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

  for (const date in concertsByDate) {
    const concerts = concertsByDate[date];
    const dateContainer = document.createElement('div');
    dateContainer.className = 'concert-date';
    dateContainer.textContent = date;
    dateContainer.onclick = () => {
      dateContainer.classList.toggle('active');
      const collapsible = dateContainer.nextElementSibling;
      collapsible.classList.toggle('active');
    };
    container.appendChild(dateContainer);

    const collapsible = document.createElement('div');
    collapsible.className = 'collapsible';
    for (const { composer, piece } of concerts) {
      const composerContainer = document.createElement('div');
      composerContainer.className = 'composer';
      composerContainer.textContent = composer;
      composerContainer.onclick = () => {
        composerContainer.classList.toggle('active');
        const collapsibleItem = composerContainer.nextElementSibling;
        collapsibleItem.classList.toggle('active');
      };
      collapsible.appendChild(composerContainer);

      const collapsibleItem = document.createElement('div');
      collapsibleItem.className = 'collapsible-item';
      collapsibleItem.textContent = piece;
      composerContainer.insertAdjacentElement('afterend', collapsibleItem);
    }
    container.appendChild(collapsible);
  }
};

// Add event listener to "Grouped by Composer" button
const composerButton = document.getElementById('by-composer');
composerButton.addEventListener('click', renderByComposer);


// Render view grouped by composer
const renderByComposer = () => {
    const container = document.getElementById('container');
    container.innerHTML = '';
  
    const composers = new Set(concertsData.map((concert) => concert.composer));
    const groupedData = {};
    
    // Group concerts data by composer and piece
    for (const composer of composers) {
      const piecesByComposer = new Set(concertsData.filter((concert) => concert.composer === composer).map((concert) => concert.piece));
      for (const piece of piecesByComposer) {
        groupedData[composer] = groupedData[composer] || {};
        groupedData[composer][piece] = concertsData.filter((concert) => concert.composer === composer && concert.piece === piece).map((concert) => concert.date);
      }
    }
  
    // Render grouped data
    for (const composer in groupedData) {
      const piecesByComposer = Object.keys(groupedData[composer]);
      const collapsible = document.createElement('div');
      collapsible.className = 'collapsible';
  
      const composerContainer = document.createElement('div');
      composerContainer.className = 'composer-container';
      composerContainer.textContent = composer;
      composerContainer.onclick = () => {
        const collapsibleItem = composerContainer.nextElementSibling;
        collapsibleItem.classList.toggle('active');
      };
      collapsible.appendChild(composerContainer);
  
      for (const piece of piecesByComposer) {
        const datesByPiece = groupedData[composer][piece];
        const pieceItem = document.createElement('div');
        pieceItem.className = 'piece-item';
        pieceItem.textContent = piece;
        pieceItem.onclick = (event) => {
          event.stopPropagation();
          const collapsibleItem = pieceItem.nextElementSibling;
          collapsibleItem.classList.toggle('active');
        };
        collapsible.appendChild(pieceItem);
  
        const collapsibleItem = document.createElement('div');
        collapsibleItem.className = 'collapsible-item';
        collapsibleItem.textContent = `Played on: ${datesByPiece.join(', ')}`;
        pieceItem.insertAdjacentElement('afterend', collapsibleItem);
      }
      container.appendChild(collapsible);
    }
  };

// Switch between views
const byDateButton = document.getElementById('by-date');
const byComposerButton = document.getElementById('by-composer');

byDateButton.onclick = () => {
byDateButton.classList.add('active');
byComposerButton.classList.remove('active');
renderByDate();
};

byComposerButton.onclick = () => {
byDateButton.classList.remove('active');
byComposerButton.classList.add('active');
renderByComposer();
};