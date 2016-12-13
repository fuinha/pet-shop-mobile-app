import React from 'react';
import { DatePickerAndroid, StyleSheet, Image, View, Text, Alert } from 'react-native';
import { Container, Header, Title, Content, List, ListItem, InputGroup, Icon, Input, Button } from 'native-base';

export default class Signup extends React.Component {

	constructor() {
		super();
		this.state = {
			nome: "",
			nascimento: "",
			email: "",
			telefone: "",
			endereco: "",
			cidade: "",
			cep: "",
			imagem: "",
			token: "",
			password: "",
			password_confirmation: ""
		};
	}

	render(){
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
								<Title style={styles.title}>Cadastro</Title>
							</View>
						</View>
					</Header>

			<Content>
				<View style={{ paddingRight: 15, borderWidth: 1, borderColor: "#c0c1c4", borderRadius: 4,  margin: 20, marginTop: 10, marginBottom: 5, justifyContent: "center" }}>
					<Image src={this.state.imagem}></Image>

					<List>
						<ListItem>
							<InputGroup>
								<Input
									ref="nome"
									placeholder="Nome"
									value={this.state.nome}
									returnKeyType={"next"}
									onChangeText={(text) => this.setState({nome: text})}
									onSubmitEditing={() => this.refs.email._textInput.focus()}
								/>
							</InputGroup>
						</ListItem>
						<ListItem>
							<InputGroup>
								<Input
									ref="email"
									placeholder="E-mail"
									keyboardType="email-address"
									value={this.state.email}
									returnKeyType={"next"}
									onChangeText={(text) => this.setState({email: text})}
									onSubmitEditing={() => this.refs.nascimento._textInput.focus()}
								/>
							</InputGroup>
						</ListItem>
						<ListItem>
							<InputGroup>
								<Input
									ref="nascimento"
									placeholder="Data de Nascimento"
									value={this.state.nascimento}
									returnKeyType={"next"}
									onFocus={() => this._showDataPicker()}
									onSubmitEditing={() => this.refs.telefone._textInput.focus()}
								/>
							</InputGroup>
						</ListItem>
						<ListItem>
							<InputGroup>
								<Input
									ref="telefone"
									placeholder="Telefone"
									keyboardType="phone-pad"
									value={this.state.telefone}
									returnKeyType={"next"}
									onChangeText={(text) => this.setState({telefone: text})}
									onSubmitEditing={() => this.refs.endereco._textInput.focus()}
								/>
							</InputGroup>
						</ListItem>
						<ListItem>
							<InputGroup>
								<Input
									ref="endereco"
									placeholder="Endereço"
									value={this.state.endereco}
									returnKeyType={"next"}
									onChangeText={(text) => this.setState({endereco: text})}
									onSubmitEditing={() => this.refs.cidade._textInput.focus()}
								/>
							</InputGroup>
						</ListItem>
						<ListItem>
							<InputGroup>
								<Input
									ref="cidade"
									placeholder="Cidade"
									value={this.state.cidade}
									returnKeyType={"next"}
									onChangeText={(text) => this.setState({cidade: text})}
									onSubmitEditing={() => this.refs.cep._textInput.focus()}
								/>
							</InputGroup>
						</ListItem>
						<ListItem>
							<InputGroup>
								<Input
									ref="cep"
									placeholder="CEP"
									keyboardType="phone-pad"
									value={this.state.cep}
									returnKeyType={"next"}
									onChangeText={(text) => this.setState({cep: text})}
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
									onSubmitEditing={() => this.refs.password_confirmation._textInput.focus()}
								/>
							</InputGroup>
						</ListItem>
						<ListItem>
							<InputGroup>
								<Input
									ref="password_confirmation"
									placeholder="Repita a senha, por favor"
									secureTextEntry={true}
									value={this.state.password_confirmation}
									onChangeText={(text) => this.setState({password_confirmation: text})}
								/>
							</InputGroup>
						</ListItem>
					</List>
					</View>

					<Button rounded bordered block style={styles.btEntrar} onPress={() => this._addClient()}>Ok!</Button>

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

	_returnView() {

		this.props.navigator.pop();
	}

	async _showDataPicker() {
		try {
			const dateReturn = {action: "", year: "", month: "", day: ""};
			dateReturn = await DatePickerAndroid.open( {
				date: new Date()
			});
			if (dateReturn.action !== DatePickerAndroid.dismissedAction) {
				console.log("Date chose");
				if (dateReturn.day < "10") dateReturn.day = "0" + dateReturn.day;
				dateReturn.month = dateReturn.month + 1;
				if (dateReturn.month < "10") dateReturn.month = "0" + dateReturn.month;

				this.setState({ nascimento: dateReturn.day + "/" + dateReturn.month + "/" + dateReturn.year});
			}
		}
		catch ({code, message}) {
			console.warn("Cannot open date picker", message);
		}
		this.refs.telefone._textInput.focus();		
	}

	_addClient() {
		fetch('http://192.168.0.101:3000/api/v1/newClient/', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify( {
				nome: this.state.nome,
				email: this.state.email,
				nascimento: this.state.nascimento,
				telefone: this.state.telefone,
				endereco: this.state.endereco,
				cidade: this.state.cidade,
				cep: this.state.cep,
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
		if(response["status"] == "201") {
			this._treatResponseContent();
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
    	marginTop: 10,
    	marginBottom: 5
  	}
});