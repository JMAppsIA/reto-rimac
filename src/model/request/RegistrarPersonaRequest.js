class RegistrarPersonaRequest {
    constructor({
        idPersona = undefined,
        nombre = undefined,
        peso = undefined,
        masa = undefined,
        colorCabello = undefined,
        colorPiel = undefined,
        colorOjos = undefined,
        fechaNacimiento = undefined,
        genero = undefined,
        mundoNatal = undefined,
        peliculas = undefined,
        especies = undefined,
        vehiculos = undefined,
        navesEstelares = undefined,
        fechaCreacion = undefined,
        fechaModificacion = undefined,
        url = undefined,
    }) {
        this.idPersona = idPersona;
        this.nombre = nombre;
        this.peso = peso;
        this.masa = masa;
        this.colorCabello = colorCabello;
        this.colorPiel = colorPiel;
        this.colorOjos = colorOjos;
        this.fechaNacimiento = fechaNacimiento;
        this.genero = genero;
        this.mundoNatal = mundoNatal;
        this.peliculas = peliculas;
        this.especies = especies;
        this.vehiculos = vehiculos;
        this.navesEstelares = navesEstelares;
        this.fechaCreacion = fechaCreacion;
        this.fechaModificacion = fechaModificacion;
        this.url = url;
    }
  }
  
  module.exports = RegistrarPersonaRequest;
  