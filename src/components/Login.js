import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Container, Button } from 'native-base';

export default class Login extends React.Component {

	render() {
		return(
			<Container>
        		<Image source={{uri: "http://oapinfo.com/images/login3.jpg" }}
               			style={styles.image}>
          			<View style={styles.viewMain}>

            			<View style={styles.view}>
              				<Text style={styles.title}>O Boticão</Text>
              				<Text style={styles.description}>Centro de Estética Pet</Text>
            			</View>
            			<View>
              				<Button style={styles.btEntrar} large bordered rounded block onPress={() => this._goToView('Signin')}> Entrar </Button>
              				<Button style={styles.btCadastrar} large bordered rounded block onPress={() => this._goToView('Signup')}> Cadastrar </Button>
            			</View>

          			</View>
        		</Image>
      		</Container>
		)
	}

	_goToView(viewName) {
		this.props.navigator.push(
			{name: viewName}
		)
	}
}


	const styles = StyleSheet.create({
		image: {
			flex: 1
		},
		viewMain: {
			flex: 1,
			backgroundColor: 'rgba(255,255,255,0.6)'			
		},
		view: {
			flex: 1
		},
  		container: {
    		flex: 1,
    		justifyContent: 'center',
    		alignItems: 'center'
  		},
	  	title: {
	    	fontSize: 60,
	    	textAlign: 'center',
	    	color: '#0489C2'
	  	},
	  	description: {
	    	fontSize: 30,
	    	textAlign: 'center',
	    	color: '#0489C2'
	  	},
	  	buttons: {
	    	flex: 1,
	    	justifyContent: 'center',
	    	margin: 20
	  	},
	  	btEntrar: {
	    	margin: 20,
	    	marginBottom: 5
	  	},
	  	btCadastrar: {
	    	margin: 20,
	    	marginTop: 10
	  	}
	});
