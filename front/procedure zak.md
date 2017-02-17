<center>PROCEDURE REACT</center>
-------

## Mise en place de sass

	si l'application a été créée via create-react-app,
	il faut eject l'application pour installer sass

Pour mettre en place sass dans un projet React,
il faut d'abord installer ces deux modules npm :

>	npm install --save node-sass sass-loader

Il faut ensuite se rendre dans le dossier __config__ et modifier les fichers
*webpack.config*

Dans chacun des fichiers, il faut modifier l'objet exclude dans l'objet module :

	exclude: [
	  /\.html$/,
	  /\.(js|jsx)$/,
	  /\.css$/,
	  /\.sass$/, <== il faut ajouter cette ligne
	  /\.json$/,
	  /\.svg$/

Et integrer le sass dans l'objet loaders :

	{
	  test: /\.css$/, <== Localiser cet objet
	  loader: 'style!css?importLoaders=1!postcss'
	},
	et ajouter les lignes ci dessous sous l'objet.
	{
		test: /\.sass$/,
		include: paths.appSrc,
		loaders: ["style", "css", "sass"]
	},

Redemarrer le serveur et les fichiers sass seront desormais pris en comptes.

## Mise en place de react-router

installer le package npm :

> npm install --save react-router

Se rendre dans le point d'entrée du projet et importer les modules suivant dans react-router (index.js)


> import { Route, Router, browserHistory, Redirect} from 'react-router';

Et modifier le ReactDOM.render de la maniere suivante

	ReactDOM.render(
		<Router history={browserHistory}> <== on choisi le type d'historique  
			<Route path="/" component={Auth}> <== on lie le path des routes a des component
				// on peux creer des sous routes ici
			</Route>
			<Route path="/app" component={App}>
			</Route>
			<Redirect from="/*" to="/" /> <== permet rediriger l'user vers le / en cas de sortie des route ci dessous
		</Router>,
	  document.getElementById('root')
	);

Il faut bien sur importer les component que les routes utilisent.
