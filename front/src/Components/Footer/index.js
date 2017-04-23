import React from 'react';
import './sass/footer.sass';

export default class Footer extends React.Component {
	render(){
		return(
      <div style={{
				position: 'fixed',
				bottom: 0,
				width: '100vw',
				margin: 0,
				padding: 0,
			}}>
        <p className="footer">asalama & zkerkeb & rle-mino</p>
      </div>
		)
	}
}
