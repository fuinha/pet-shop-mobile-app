import React from 'react';
import { Image, View, Text, Alert } from 'react-native';
import { Container, Content, List, ListItem, InputGroup, Icon, Input, Button } from 'native-base';

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

			<Content>
					<Text>Cadastro</Text>
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
									onChangeText={(text) => this.setState({nascimento: text})}
									onSubmitEditing={() => this.refs.telefone._textInput.focus()}
								/>
							</InputGroup>
						</ListItem>
						<ListItem>
							<InputGroup>
								<Input
									ref="telefone"
									placeholder="Telefone"
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
									keyboardType="email-address"
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
									placeholder="Repita a Senha, por favor"
									secureTextEntry={true}
									value={this.state.password_confirmation}
									onChangeText={(text) => this.setState({password_confirmation: text})}
								/>
							</InputGroup>
						</ListItem>
					</List>
					<Button onPress={() => this._addClient()}>Ok!</Button>
					<Button onPress={() => this._goToView('Login')}>Voltar</Button>
					<Text>{this.state.response}</Text>
				</Content>
			</Container>

		)
	}

	_goToView(viewName) {
		this.props.navigator.push(
			{name: viewName}
		)
	}

	_addClient() {
		fetch('http://192.168.0.100:3000/api/v1/newClient/', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify( {
				nome: this.state.nome,
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
		if(response["status"] == "422") {
			this._alert("Ops! :(",
						"Parece que você ainda não possui cadastro. Vamos resolver isso, é rápido!");
		}
		if(response["status"] == "201") {
			this._alert("Cadastro criado com sucesso!",
						"Pronto! Agora precisamos confirmar seu endereço");
		} 
	}

	_alert(title, message) {

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