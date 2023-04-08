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

// Render view by composer
const renderByComposer = () => {
  const container = document.getElementById('concerts-container');
  container.innerHTML = '';

  const concertsByComposer = {};

  for (const [date, composer, piece] of concertsData) {
    if (!concertsByComposer[composer]) {
      concertsByComposer[composer] = {};
    }
    if (!concertsByComposer[composer][piece]) {
      concertsByComposer[composer][piece] = [];
    }
    concertsByComposer[composer][piece].push(date);
  }

  for (const composer in concertsByComposer) {
    const pieces = concertsByComposer[composer];
    const composerContainer = document.createElement('div');
    composerContainer.className = 'composer';
    composerContainer.textContent = composer;
    composerContainer.onclick = () => {
      composerContainer.classList.toggle('active');
      const collapsible = composerContainer.nextElementSibling;
      collapsible.classList.toggle('active');
    };
    container.appendChild(composerContainer);

    const collapsible = document.createElement('div');
    collapsible.className = 'collapsible';
    for (const piece in pieces) {
      const dates = pieces[piece];
      const pieceContainer = document.createElement('div');
      pieceContainer.className = 'piece';
      pieceContainer.textContent = piece;
      pieceContainer.onclick = () => {
        pieceContainer.classList.toggle('active');
        const collapsibleItem = pieceContainer.nextElementSibling;
        collapsibleItem.classList.toggle('active');
        };
      collapsible.appendChild(pieceContainer);
      const collapsibleItem = document.createElement('div');
      collapsibleItem.className = 'collapsible-item';
      collapsibleItem.textContent = `Played on: ${dates.join(', ')}`;
      pieceContainer.insertAdjacentElement('afterend', collapsibleItem);
      }
    container.appendChild(collapsible);
  }
};

// Switch between views
const byDateButton = document.getElementById('by-date-button');
const byComposerButton = document.getElementById('by-composer-button');

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