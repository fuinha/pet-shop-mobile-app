import React from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import { Header, Title, Container, Content, List, ListItem, InputGroup, Icon, Input, Button } from 'native-base';

export default class RestartClientPass extends React.Component {

	constructor() {
		super();
		this.state = {
			nome: "",
			email: "",
			token: "",
			password: "",
			password_confirmation: ""
		};
	}

	render(){
		return(

			<Container>
				<Header style={styles.header}>
					<Title style={styles.title}>Alterar Senha</Title>
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
									placeholder="Nova senha"
									secureTextEntry={true}
									value={this.state.password}
									returnKeyType={"next"}
									onChangeText={(text) => this.setState({password: text})}
									onSubmitEditing={() => this.refs.password_confirmation._textInput.focus()}
								/>
							</InputGroup>
						</ListItem>
						<ListItem>
							<InputGroup>
								<Input
									ref="password_confirmation"
									placeholder="Repita a nova senha, por favor"
									secureTextEntry={true}
									value={this.state.password_confirmation}
									onChangeText={(text) => this.setState({password_confirmation: text})}
								/>
							</InputGroup>
						</ListItem>
					</List>
					</View>

					<Button rounded bordered block style={styles.btEntrar} onPress={() => this._restartClientPass()}>Ok!</Button>
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

	_restartClientPass() {
		fetch('http://192.168.0.103:3000/api/v1/restartClientPass', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify( {
				email: this.state.email,
				password: this.state.password,
				password_confirmation: this.state.password_confirmation,
				modo_autenticacao: "sistema"
			})})
			.then(
					(response) => this._analyzeResponse(response)
			)
			.catch((error) => console.error(error));
	}

	_analyzeResponse(response) {
		if(response["status"] == "202") {
			Alert.alert("Sucesso!",
					"Sua senha foi alterada. " +
					"Por favor, utilize-a para fazer login.",
					[{text: "Ok", onPress: () => this._goToView("Signin")}]);

		}
		if(response["status"] == "422") {
			Alert.alert("Ops! :(",
						"Algo inesperado ocorreu no servidor. Tente novamente em alguns minutos, por favor!");
		}
		if(response["status"] == "404") {
			Alert.alert("Ops! :(",
						"O e-mail informado não foi encontrado. Verifique se está correto e tente novamente, por favor!");
			this.refs.email._textInput.focus();
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
		Alert.alert("Obrigado " + this.state.nome + "!",
					"Agora que sabemos quem você é, precisamos saber quem são seus amigos. " +
					"Depois de adicioná-los, é só agendar um dos serviços oferecidos através do menu!",
					[{text: "Ok", onPress: () => this._goToView("PetForm", this.state)}]);
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
  	},
	header: {
		backgroundColor: "#f0f0f0"
	},
	title: {
		color: "#6d6e70"
	}
});