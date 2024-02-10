function getPokemon(name) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
        .then(response => response.json())
        .then(data => {
            const image = document.createElement('img');
            image.src = data.sprites.front_default;   
            document.body.appendChild(image);
        })
        .catch(error => {
            console.log(error);
        });
}

function getPokemonByGeneration(genID) {
    fetch(`https://pokeapi.co/api/v2/generation/${genID}`)
        .then(response => response.json())
        .then(data => {
            const species = data.pokemon_species;
            species.forEach(pokemon => {
                getPokemon(pokemon.name);
            });
        })
        .catch(error => {
            console.log(error);
        });
}

function getIdByName(cityName) {
  return new Promise((resolve, reject) => {
    fetch(`http://localhost:8000/cities?name=${cityName}`)
      .then(response => response.json())
      .then(data => {
        // const cityID = data[0].id;
        const [{ id }] = data;
        resolve(id);
      })
      .catch(error => {
        reject(error);
      });
  })
}

async function removeCity(cityName) {
  try {
    const cityID = await getIdByName(cityName);
    console.log('CityID --->> ', cityID)
    const res = await fetch(`http://localhost:8000/cities/${cityID}`, {
      method: 'DELETE'
    })
    const resParsed = await res.json();
    console.log(resParsed);
  } catch (error) {
    console.log(error);
  }
}

function saveCity (cityName) {
  const saveData = {
    name: cityName
  };
  const jsonData = JSON.stringify(saveData);

  /**
   * Hacemos una petición POST a la API, enviando los datos
   * en formato JSON. La API nos devolverá un objeto en un formato
   * que a priori no entendemos. Por eso, lo primero que tenemos
   * que hacer es convertir la respuesta a un objeto JSON.
   * 
   * Si no convertimos la respuesta a un objeto JSON, no podremos
   * acceder a los datos que nos devuelve la API.
   * 
   * La función fetch devuelve una promesa, por lo que podemos
   * encadenar un .then() para convertir la respuesta a un objeto
   * JSON y posteriormente, otro .then() para acceder a los datos
   * que nos devuelve la API.
   * 
   * Si hay un error en la petición, se ejecutará el bloque catch.
   */
  fetch('http://localhost:8000/cities', {
    method: 'POST',
    body: jsonData
  }).then(res => res.json())
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.log(error);
    });
}

/**
 * Acordaros que para poder utilizar el await en una función,
 * la función debe ser declarada con la palabra reservada async.
 */
async function updateCity(cityName, newCityName) {
  /**
   * Intentar ejecutar el código que se encuentra entre las
   * llaves. Si hay un error, se ejecutará el código que
   * se encuentra en el bloque catch.
   */
  try {
    /**
     * Con el await, esperamos a que la promesa que devuelve la
     * función getIdByName se resuelva. Una vez que se resuelva,
     * el valor que devuelve la promesa se asignará a la variable
     * cityID.
     */
    const cityID = await getIdByName(cityName);
    console.log('CityID --->> ', cityID)

    /**
     * Acordaros que para realizar una petición PUT o POST, necesitamos
     * enviar los datos en formato JSON. Por eso, creamos un objeto
     * con los datos que queremos enviar y lo convertimos a JSON.
     */
    const saveData = {
      name: newCityName
    };
    const jsonData = JSON.stringify(saveData);

    /**
     * Por último, hacemos la petición PUT a la API, enviando los datos
     * en formato JSON.
     */
    const res = await fetch(`http://localhost:8000/cities/${cityID}`, {
      method: 'PUT',
      body: jsonData
    })
    /**
     * SIEMPRE SIEMPRE SIEMPRE, después de hacer una petición a una API,
     * debemos convertir la respuesta a un objeto JSON. Si no lo hacemos,
     * no podremos acceder a los datos que nos devuelve la API.
     */
    const resParsed = await res.json();
    console.log(resParsed);
  } catch (error) {
    console.log(error);
  }
}

function getAllCities() {
  fetch('http://localhost:8000/cities')
    .then(response => response.json())
    .then(data => {
      const list = document.createElement('ul');
      data.forEach(city => {
        const item = document.createElement('li');
        item.textContent = city.name;
        item.setAttribute('id', city.id);
        list.appendChild(item);
      });
      document.body.appendChild(list);
    })
    .catch(error => {
      console.log(error);
    });
}

const button = document.querySelector('button');
button.addEventListener('click', (event) => {
  event.preventDefault();

  const cityName = document.querySelector('input').value;
  console.log(cityName);

  saveCity(cityName);
});

const removeButton = document.querySelector('#removeBtn');
removeButton.addEventListener('click', (event) => {
  event.preventDefault();

  const cityName = document.querySelector('input').value;
  console.log(cityName);

  removeCity(cityName);
});

const updateButton = document.querySelector('#updateBtn');
updateButton.addEventListener('click', (event) => {
  event.preventDefault();

  const cityName = 'Badajoz'
  const newCityName = document.querySelector('input').value;
  console.log(newCityName);

  updateCity(cityName, newCityName);
});

getAllCities()