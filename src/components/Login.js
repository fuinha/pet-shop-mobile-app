import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Container, Button } from 'native-base';

export default class Login extends React.Component {

	render() {
		return(
			<Container>
        		<Image source={{uri: "http://oapinfo.com/images/login.jpg" }}
               			style={{flex: 1}}>
          			<View style={{flex: 1, backgroundColor: 'rgba(255,255,255,0.6)'}}>

            			<View style={{flex: 1}}>
              				<Text>O Boticão</Text>
              				<Text>Centro de Estética Pet</Text>
            			</View>
            			<View>
              				<Button large rounded block onPress={() => this._goToView('Signin')}> Entrar </Button>
              				<Button large rounded block onPress={() => this._goToView('Signup')}> Cadastrar </Button>
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
	    	justifyContent: 'center'
	  	},
	  	btEntrar: {
	    	margin: 20
	  	},
	  	btCadastrar: {
	    	margin: 20
	  	}
	});
