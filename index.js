const PUBLIC_KEY = 'd6243d185f063e4448bbc059d9731d9b'; 
const PRIVATE_KEY = 'fcc0d6fb605b6bf612f7d94f6613054c6d3111a9'; 

function generateHash(ts) {
    return CryptoJS.MD5(ts + PRIVATE_KEY + PUBLIC_KEY).toString();
}

const ts = Date.now();
const hash = generateHash(ts);

const apiUrl = `https://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${PUBLIC_KEY}&hash=${hash}`;

console.log(`API URL: ${apiUrl}`);

fetch(apiUrl)
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

        
        if (data.data && data.data.results) {
            const characterList = document.getElementById('character-list');

            data.data.results.forEach(character => {
                const li = document.createElement('li');
                li.textContent = character.name; 
                characterList.appendChild(li); 
            });
        } else {
            console.log('No characters found.');
        }
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });





