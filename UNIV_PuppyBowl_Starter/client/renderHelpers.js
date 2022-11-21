
import { addNewPlayer, fetchAllPlayers, fetchSinglePlayer, removePlayer } from './ajaxHelpers';

const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

export const renderAllPlayers = (playerList) => {
  // First check if we have any data before trying to render it!
  if (!playerList || !playerList.length) {
    playerContainer.innerHTML = '<h3>No players to display!</h3>';
    return;
  }

  // Loop through the list of players, and construct some HTML to display each one
  let playerContainerHTML = '';
  for (let i = 0; i < playerList.length; i++) {
    const pup = playerList[i];
    let pupHTML = `
      <div class="single-player-card">
        <div class="header-info">
          <p class="pup-title">${pup.name}</p>
          <p class="pup-number">#${pup.id}</p>
        </div>
        <img src="${pup.imageUrl}" alt="photo of ${pup.name} the puppy">
        <button class="detail-button" data-id=${pup.id}>See details</button>
        <button class="removePlayer" data-id=${pup.id}>Remove From Roster</button>
      </div>
    `;
    playerContainerHTML += pupHTML;
  }

  // After looping, fill the `playerContainer` div with the HTML we constructed above
  playerContainer.innerHTML = playerContainerHTML;

  // Now that the HTML for all players has been added to the DOM,
  // we want to grab those "See details" buttons on each player
  // and attach a click handler to each one
  let detailButtons = [...document.getElementsByClassName('detail-button')];
  let removeBtn = [...document.getElementsByClassName('removePlayer')];
  for (let i = 0; i < detailButtons.length; i++) {
    const button = detailButtons[i];
    button.addEventListener('click', async (ev) => {
      let pupId = ev.target.getAttribute('data-id');
      fetchSinglePlayer(~~pupId);
    });
    const remBtn = removeBtn[i];
    remBtn.addEventListener('click', async (ev) => {
      let pup = ev.target.getAttribute('data-id');
      await removePlayer(~~pup);
      const players = await fetchAllPlayers();
       renderAllPlayers(players);
    })
  }
};

export const renderSinglePlayer = (playerObj) => {
  if (!playerObj || !playerObj.id) {
    playerContainer.innerHTML = "<h3>Couldn't find data for this player!</h3>";
    return;
  }

  let pupHTML = `
    <div class="single-player-view">
      <div class="header-info">
        <p class="pup-title">${playerObj.name}</p>
        <p class="pup-number">#${playerObj.id}</p>
      </div>
      <p>Team: ${playerObj.team ? playerObj.team.name : 'Unassigned'}</p>
      <p>Breed: ${playerObj.breed}</p>
      <img src="${playerObj.imageUrl}" alt="photo of ${
    playerObj.name
  } the puppy">
      <button id="see-all">Back to all players</button>
    </div>
  `;

  playerContainer.innerHTML = pupHTML;
  let seeAll = document.querySelector('#see-all');
  seeAll.style.backgroundColor = 'var(--accentColor2)';
  seeAll.style.borderRadius = '.5rem';
  seeAll.style.margin = '.2rem';
  seeAll.style.boxShadow = '.01em .01em rgba(14, 0, 21, 0.74), -.2em 0 .5em rgba(0, 0, 0, 0.785)';
  seeAll.addEventListener('mouseover', () => {
    seeAll.style.transform = 'translateY(-7%)';
  })
  seeAll.addEventListener('mouseout', () => {
    seeAll.style.transform = 'translateY(7%)';
  })
  seeAll.addEventListener('click', async () => {
    let players = await fetchAllPlayers();
    renderAllPlayers(players);
    seeAll.removeEventListener('moveover');
    seeAll.removeEventListener('moveout');
  })
};

export const renderNewPlayerForm = () => {
  let formHTML = `
    <form>
      <label for="name">Name:</label>
      <input type="text" name="name" />
      <label for="breed">Breed:</label>
      <input type="text" name="breed" />
      <button type="submit">Submit</button>
    </form>
  `;
  newPlayerFormContainer.innerHTML = formHTML;

  let form = document.querySelector('#new-player-form > form');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    let name = event.target.name;
    let breed = event.target.breed;
    let dogInfo = {
      name: `${name.value}`,
      breed: `${breed.value}`,
      imageUrl: `https://assets3.cbsnewsstatic.com/hub/i/r/2012/10/23/135c722c-a645-11e2-a3f0-029118418759/thumbnail/1240x930/15c235e62c64d5e9abf5c616c40df109/ROCCO_BostonTerrier_7years2.jpg`,
    };
    await addNewPlayer(dogInfo);
    let players = await fetchAllPlayers();
    renderAllPlayers(players);
    renderNewPlayerForm();
  });
};