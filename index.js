const PUBLIC_KEY = 'd6243d185f063e4448bbc059d9731d9b';
const PRIVATE_KEY = 'fcc0d6fb605b6bf612f7d94f6613054c6d3111a9';

function generateHash(ts) {
    return CryptoJS.MD5(ts + PRIVATE_KEY + PUBLIC_KEY).toString();
}

const ts = Date.now();
const hash = generateHash(ts);

// URL for fetching characters
const characterApiUrl = `https://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${PUBLIC_KEY}&hash=${hash}`;

// Function to fetch characters and add them to the DOM
function fetchCharacters() {
    fetch(characterApiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log(data); // Log the full response data

            // Check for errors in the API response
            if (data.code && data.code !== 200) {
                console.error(`Error from API: ${data.message}`);
                return;
            }

            // Extract and display the characters
            if (data.data && data.data.results) {
                const characterList = document.getElementById('character-list');
                characterList.innerHTML = ''; // Clear any existing characters

                data.data.results.forEach(character => {
                    const li = document.createElement('li');
                    li.textContent = character.name;
                    li.dataset.characterId = character.id; // Store the character ID in a data attribute
                    li.addEventListener('click', () => fetchComicsForCharacter(character.id)); // Add click event to fetch comics for this character
                    characterList.appendChild(li);
                });
            } else {
                console.log('No characters found.');
            }
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

// Function to fetch comics for a specific character
function fetchComicsForCharacter(characterId) {
    const comicsApiUrl = `https://gateway.marvel.com/v1/public/characters/${characterId}/comics?ts=${ts}&apikey=${PUBLIC_KEY}&hash=${hash}`;

    fetch(comicsApiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log(data); // Log the full response data

            // Check for errors in the API response
            if (data.code && data.code !== 200) {
                console.error(`Error from API: ${data.message}`);
                return;
            }

            // Extract and display the comics
            if (data.data && data.data.results) {
                const comicsList = document.getElementById('comics-list');
                comicsList.innerHTML = ''; // Clear any existing comics

                data.data.results.forEach(comic => {
                    const li = document.createElement('li');
                    li.textContent = comic.title; // Display the title of the comic
                    comicsList.appendChild(li);
                });
            } else {
                console.log('No comics found for this character.');
            }
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

// Fetch characters when the page loads
fetchCharacters();






