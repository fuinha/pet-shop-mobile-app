import React from 'react';
import { AsyncStorage, StyleSheet, View, Text, Alert } from 'react-native';
import { Container, Header, Title, Content, List, ListItem, InputGroup, Icon, Input, Button } from 'native-base';

export default class Signin extends React.Component {

	constructor() {
		super();
		this.state = {email: "", password: "", token: "", responseStatus: "", responseJson: ""};
	}

	render() {
		return(
			<Container>
					<Header style={styles.header}>
						<View style={{flex: 1, flexDirection: "row"}}>
							<View style={{width: 30}}>
								<Button transparent onPress={() => this._returnView()}>
									<Icon name="angle-left" style={styles.headerIcon} />
								</Button>
							</View>
							<View style={{flex: 1, flexDirection: "row", justifyContent: "center", paddingRight: 30}}>
								<Title style={styles.title}>Login</Title>
							</View>
						</View>
					</Header>
				<Content>
					<View style={{ paddingRight: 15, borderWidth: 1, borderColor: "#c0c1c4", borderRadius: 4,  margin: 20, marginTop: 40, justifyContent: "center" }}>
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
					</View>
					<Button rounded bordered block style={styles.btEntrar} onPress={() => this._login()}>Entrar</Button>
					<Button rounded bordered block style={styles.btEsqueci} onPress={() => this._goToView("RestartClientPass", "")}>Esqueci a senha</Button>
					<Text>{this.state.response}</Text>
				</Content>
			</Container>
		)
	}

	_resetTo(viewName, viewState) {
		console.log(this.props.navigator.getCurrentRoutes());
		this.props.navigator.resetTo(
			{name: viewName,
			 state: viewState}
		);
		console.log(this.props.navigator.getCurrentRoutes());
	}

	_goToView(viewName, viewState) {
		this.props.navigator.push(
			{name: viewName,
			 state: viewState}
		);

	}

	_returnView() {

		this.props.navigator.pop();
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

		this._resetTo("Menu", this.state);
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
	header: {
		backgroundColor: "#f0f0f0",
		paddingLeft: 15,
		paddingRight: 15
	},
	title: {
		color: "#6d6e70",
		justifyContent: "center"
	},
	buttons: {
		margin: 20
	},
	btEntrar: {
    	margin: 20,
    	marginBottom: 5
  	},
  	btEsqueci: {
    	margin: 20,
    	marginTop: 10  		
  	}
});