import React from 'react';
import { AsyncStorage, StyleSheet, View, Text, Alert } from 'react-native';
import axios from 'axios';
import { Container, Content, List, ListItem, InputGroup, Icon, Input, Button } from 'native-base';

export default class Signin extends React.Component {

	constructor() {
		super();
		this.state = {email: "", password: "", token: "", responseStatus: "", responseJson: ""};
	}

	render() {
		return(
			<Container>
				<Content>
					<Text style={styles.titulo}>Informe e-mail e senha cadastrados para entrar no aplicativo</Text>
					<List>
						<ListItem>
							<InputGroup>
								<Input
									ref="email"
									placeholder="E-mail"
									keyboardType="email-address"
									value={this.state.email}
									returnKeyType={"next"}
									onChangeText={(text) => this.setState({email: text})}
									onSubmitEditing={() => this.refs.password._textInput.focus()}
								/>
							</InputGroup>
						</ListItem>
						<ListItem>
							<InputGroup>
								<Input
									ref="password"
									placeholder="Senha"
									secureTextEntry={true}
									value={this.state.password}
									onChangeText={(text) => this.setState({password: text})}
								/>
							</InputGroup>
						</ListItem>
					</List>
					<Button rounded bordered block style={styles.btEntrar} onPress={() => this._login()}>Entrar</Button>
					<Button rounded bordered block style={styles.btVoltar} onPress={() => this._goToView("Login", "")}>Voltar</Button>
					<Text>{this.state.response}</Text>
				</Content>
			</Container>
		)
	}

	_goToView(viewName, viewState) {
		this.props.navigator.push(
			{name: viewName,
			 state: viewState}
		)
	}

	_login() {
		
		fetch('http://192.168.0.103:3000/api/v1/loginClient/', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify( {
				email: this.state.email,
				password: this.state.password,
				modo_autenticacao: "sistema"
			})})
			.then(
				(response) => {
					this.setState({responseStatus: response["status"]});
					console.log("then - response " + this.state.responseStatus);
					return response.json();
				}
			)
			.then(
				(responseJson) => {
					this.setState({responseJson: responseJson});
					console.log("then - responseJson " + this.state.responseJson["token"]);
					this._analyzeResponse();
				}
			)
			.catch((error) => console.error(error));
		
	}

	_analyzeResponse() {
		if(this.state.responseStatus == "202") {
			console.log("analyzeResponse");
			this._treatResponseContent();
		}
		
		if(this.state.responseStatus == "401") {
			Alert.alert("Ops! :(",
						"Parece que a senha informada não está correta. Vamos tentar novamente!");
			this.setState({password: ""});
			this.refs.password._textInput.focus();
		}		

		if(this.state.responseStatus == "404") {
			this._alertOkCancel("Ops! :(",
						"Parece que você ainda não possui cadastro. Vamos resolver isso, é rápido!");
		}

		if(this.state.responseStatus == "422") {
			this._alertOk("Ops! :(",
						"Algo inesperado ocorreu no servidor. Tente novamente dentro de alguns instantes, por favor!");
		}

	}

	_treatResponseContent() {
		try {
			console.log("treatResponseContent");
			this.setState({token: this.state.responseJson["token"]});
			this._persistData();
		}
		catch(error) {
			console.log("error: " + error);
		}

		this._goToView("Menu", this.state);
	}

	async _persistData() {
		console.log("persistData - before asyncstorage");
		try {
			await AsyncStorage.setItem("oboticaoState", JSON.stringify(this.state));
		}
		catch(error) {
			console.log("error: " + error);
		}
		console.log("persistData - after asyncstorage")

	}

	_alertOk(title, message) {

		Alert.alert(
			title,
			message,
			[
				{text: "Ok", onPress: () => this._goToView('Signin') }
			]
		)

	}

	_alertOkCancel(title, message) {

		Alert.alert(
			title,
			message,
			[
				{text: "Cancelar", onPress: () => this._goToView('Login') },
				{text: "Ok", onPress: () => this._goToView('Signup') }
			]
		)

	}

}

const styles = StyleSheet.create( {
	titulo: {
		textAlign: "center"
	},
	buttons: {
		margin: 20
	},
	btEntrar: {
    	margin: 20,
    	marginBottom: 5
  	},
  	btVoltar: {
    	margin: 20,
    	marginTop: 10
  	}
});