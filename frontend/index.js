import { backend } from 'declarations/backend';

document.addEventListener('DOMContentLoaded', async () => {
  const umbrellaList = document.getElementById('umbrella-list');
  const addUmbrellaButton = document.getElementById('add-umbrella');
  const refreshListButton = document.getElementById('refresh-list');

  async function refreshUmbrellaList() {
    umbrellaList.innerHTML = '';
    const umbrellas = await backend.listAvailableUmbrellas();
    umbrellas.forEach(umbrella => {
      const li = document.createElement('li');
      li.textContent = `Umbrella ${umbrella.id} at ${umbrella.location}`;
      const reserveButton = document.createElement('button');
      reserveButton.textContent = 'Reserve';
      reserveButton.onclick = async () => {
        const success = await backend.reserveUmbrella(umbrella.id);
        if (success) {
          alert('Umbrella reserved successfully!');
          refreshUmbrellaList();
        } else {
          alert('Failed to reserve umbrella.');
        }
      };
      li.appendChild(reserveButton);
      umbrellaList.appendChild(li);
    });
  }

  addUmbrellaButton.onclick = async () => {
    const location = prompt('Enter umbrella location:');
    if (location) {
      await backend.addUmbrella(location);
      refreshUmbrellaList();
    }
  };

  refreshListButton.onclick = refreshUmbrellaList;

  // Initial load
  refreshUmbrellaList();
});
