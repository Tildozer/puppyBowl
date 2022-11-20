import { renderSinglePlayer } from "./renderHelpers";

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2209-FTB-ET-WEB-AM';
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players`;

export const fetchAllPlayers = async () => {
  const response = await fetch(`${APIURL}`);
  const data = await response.json();
  const puppies = data.data.players;
  console.log(puppies)
  return puppies;
};
export const fetchSinglePlayer = async (playerId) => {
  const response = await fetch(`${APIURL}`);
  const data = await response.json();
  const puppies = data.data.players;
    for(let i = 0; i < puppies.length; i++){
      let puppy = puppies[i];
        if(playerId === puppy.id){
          renderSinglePlayer(puppy);
        }
    }
};


export const addNewPlayer = async (playerObj) => {
  await fetch(`${APIURL}`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(playerObj),
  }).then(res => res.json())
  .then(data => {
    console.log('data', data);
  })
  .catch((error) => {
    console.error('error', error);
  });
}
export const removePlayer = async (playerId) => {
      await fetch(`${APIURL}/${playerId}`, {
        method: "DELETE",
      }).then(res => res.json())
        .then(data => {
          console.log('data', data);
        })
        .catch((error) => {
          console.error('error', error);
        });
  };
