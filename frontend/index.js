import { backend } from 'declarations/backend';
import { AuthClient } from '@dfinity/auth-client';

let authClient;
let map;
let markers = [];

document.addEventListener('DOMContentLoaded', async () => {
  const umbrellaList = document.getElementById('umbrella-list');
  const addUmbrellaButton = document.getElementById('add-umbrella');
  const refreshListButton = document.getElementById('refresh-list');
  const loginButton = document.getElementById('login-button');
  const logoutButton = document.getElementById('logout-button');
  const usernameInput = document.getElementById('username-input');

  authClient = await AuthClient.create();

  loginButton.onclick = async () => {
    const username = usernameInput.value;
    if (username) {
      await authClient.login({
        onSuccess: async () => {
          const success = await backend.createUser(username);
          if (success) {
            updateAuthButtons(true);
            refreshUmbrellaList();
          } else {
            alert('Failed to create user or user already exists.');
          }
        },
      });
    } else {
      alert('Please enter a username.');
    }
  };

  logoutButton.onclick = async () => {
    await authClient.logout();
    updateAuthButtons(false);
  };

  function updateAuthButtons(isAuthenticated) {
    loginButton.style.display = isAuthenticated ? 'none' : 'inline-block';
    logoutButton.style.display = isAuthenticated ? 'inline-block' : 'none';
    usernameInput.style.display = isAuthenticated ? 'none' : 'inline-block';
    addUmbrellaButton.disabled = !isAuthenticated;
  }

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
    updateMap(umbrellas);
  }

  addUmbrellaButton.onclick = async () => {
    const location = prompt('Enter umbrella location:');
    const latitude = parseFloat(prompt('Enter latitude:'));
    const longitude = parseFloat(prompt('Enter longitude:'));
    if (location && !isNaN(latitude) && !isNaN(longitude)) {
      const umbrellaId = await backend.addUmbrella(location, latitude, longitude);
      if (umbrellaId !== null) {
        refreshUmbrellaList();
      } else {
        alert('Failed to add umbrella. Please make sure you are logged in.');
      }
    }
  };

  refreshListButton.onclick = refreshUmbrellaList;

  // Initialize map
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 0, lng: 0 },
    zoom: 2
  });

  function updateMap(umbrellas) {
    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    markers = [];

    // Add new markers
    umbrellas.forEach(umbrella => {
      const marker = new google.maps.Marker({
        position: { lat: umbrella.latitude, lng: umbrella.longitude },
        map: map,
        title: `Umbrella ${umbrella.id} at ${umbrella.location}`
      });
      markers.push(marker);
    });

    // Adjust map bounds to fit all markers
    if (markers.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      markers.forEach(marker => bounds.extend(marker.getPosition()));
      map.fitBounds(bounds);
    }
  }

  // Initial load
  updateAuthButtons(await authClient.isAuthenticated());
  refreshUmbrellaList();
});
