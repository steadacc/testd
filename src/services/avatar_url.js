const basicPalette = ["#E07A5F", "#3D405B", "#81B29A", "#577590", "#8c2f39", "#118ab2", "bf1363", "#ffa69e", "#9c89b8", "#4f5d75", "#308403"];

// genera un avatar in base a nome e opzioni passate
const create = (name, options) => {
  if (!options) {
    options = {}
  }

  //sovrascrive la paletta dei colori se passata nelle opzioni
  if (!options.palette) {
    options.palette = basicPalette;
  }
  let size = "14px"; // dimensione del testo base
  let fill = options.palette[Math.floor(Math.random() * options.palette.length)] // estrare un colore a caso dalla palette
  let color = "#ffffff"; // colore del testo

  // se opzione invertita usa il colore di inverted come sfondo e il colore della plaetta come testo
  if (options.inverted) {
    color = fill;
    fill = options.inverted;
  }

  // estrae le iniziali, al massimo 3 lettere
  let initials = name.match(/\b\w/g) || [];
  initials = ((initials.shift() || '') + (initials.shift() || '') + (initials.pop() || '')).toUpperCase();
  if (initials.length > 3) {
    initials = initials.substring(0, 2);
  }
  // se sono 3 riduce la dimensione del testo
  if (initials.length == 3) {
    size = "12px"
  }

  // genera svg
  let ret = "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" version=\"1.1\" style=\"isolation:isolate\" viewBox=\"0 0 32 32\"><path d=\"M0 0h32v32H0V0z\" fill=\"" + fill + "\" /><text font-family=\"Helvetica\" font-size=\"" + size + "\" x=\"50%\" y=\"50%\" dy=\"0.3em\" fill=\"" + color + "\" text-anchor=\"middle\">" + initials + "</text></svg>";

  // se passata option.baseurl ritorna il base
  if (options.baseurl) {
    let b = new Buffer(ret);
    return "data:image/svg+xml;base64, " + b.toString('base64');
  }
  // altrimenti ritorna svg originale
  else {
    return ret;
  }

};

exports.create = create;
