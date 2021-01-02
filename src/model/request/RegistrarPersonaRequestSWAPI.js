class RegistrarPersonaRequestSWAPI {
    constructor({
        name = undefined,
        height = undefined,
        mass = undefined,
        hair_color = undefined,
        skin_color = undefined,
        eye_color = undefined,
        birth_year = undefined,
        gender = undefined,
        homeworld = undefined,
        films = undefined,
        species = undefined,
        vehicles = undefined,
        starships = undefined,
        created = undefined,
        edited = undefined,
        url = undefined
    },idPersona) {
        this.idPersona = idPersona;
        this.nombre = name;
        this.peso = height;
        this.masa = mass;
        this.colorCabello = hair_color;
        this.colorPiel = skin_color;
        this.colorOjos = eye_color;
        this.fechaNacimiento = birth_year;
        this.genero = gender;
        this.mundoNatal = homeworld;
        this.peliculas = films;
        this.especies = species;
        this.vehiculos = vehicles;
        this.navesEstelares = starships;
        this.fechaCreacion = created;
        this.fechaModificacion = edited;
        this.url = url;
    }
  }
  
  module.exports = RegistrarPersonaRequestSWAPI;
  