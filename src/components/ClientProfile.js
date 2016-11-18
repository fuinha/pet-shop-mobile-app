import React from 'react';
import { Alert, AsyncStorage, ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import { Container, Header, Content, List, ListItem, InputGroup, Input, Footer, FooterTab, Button } from 'native-base';

export default class ClientProfile extends React.Component {

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
			currentPosition: ""
		};
	}

	componentWillMount() {
		this._fetchData();
	}

	render() {
		return(

			<Container>
				<Header>
					<Text>O Boticão - Client Profile</Text>
				</Header>
				<Content>
					<Image src={this.state.imagem}></Image>
					
					<List>
						<ListItem>
							<InputGroup disabled>
								<Input
									ref="nome"
									value={this.state.nome}
								/>
							</InputGroup>
						</ListItem>
						<ListItem>
							<InputGroup disabled>
								<Input
									ref="email"
									value={this.state.email}
								/>
							</InputGroup>
						</ListItem>
						<ListItem>
							<InputGroup disabled>
								<Input
									ref="nascimento"
									value={"Nascimento: " + this.state.nascimento}
								/>
							</InputGroup>
						</ListItem>
						<ListItem>
							<InputGroup disabled>
								<Input
									ref="telefone"
									value={"Telefone: " + this.state.telefone}
								/>
							</InputGroup>
						</ListItem>
						<ListItem>
							<InputGroup disabled>
								<Input
									ref="endereco"
									value={this.state.endereco}
								/>
							</InputGroup>
						</ListItem>
						<ListItem>
							<InputGroup disabled>
								<Input
									ref="cidade"
									value={this.state.cidade}
								/>
							</InputGroup>
						</ListItem>
						<ListItem>
							<InputGroup disabled>
								<Input
									ref="cep"
									value={"CEP: " + this.state.cep}
								/>
							</InputGroup>
						</ListItem>
					</List>
					<Button onPress={() => this._fetchData()}>Baixar</Button>
					<Button onPress={() => this._getGeoPosition()}>Posição</Button>

				</Content>
				<Footer>
					<FooterTab>
						<Button onPress={() => this._goToView("ClientProfile", this.props.authState)}>Eu</Button>
					
						<Button onPress={() => this._goToView("PetProfile", this.props.authState)}>Pets</Button>
					
						<Button onPress={() => this._goToView("ServiceCategories", "")}>Serviços</Button>
					
						<Button onPress={() => this._goToView("Schedule", this.props.authState)}>Agenda</Button>
					</FooterTab>
				</Footer>     			
      		</Container>
		)
	}

	_goToView(viewName, viewState) {
		this.props.navigator.push(
			{name: viewName,
			 state: viewState}
		)
	}

	/*async _verifyToken() {

		try {
			localState = JSON.parse(await AsyncStorage.getItem('oboticaoState'));
			this.setState({email: localState["email"], token: localState["token"]});
			if(this.state.token != "") {
				console.log("email: " + this.state.email + " token: " + this.state.token);
			}
			else{
				console.log("token blank", "blank");
			}
		}
		catch(error) {
			console.log("error: ", error);
		}
	}*/

	_fetchData() {

		fetch("http://192.168.0.101:3000/api/v1/clientProfile?email=" + this.props.authState.email + "&token=" + this.props.authState.token,
			{
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
			}})
			.then(
				(response) => {
					this.setState({responseStatus: response["status"]});
					return response.json();
				}
			)
			.then(
				(responseJson) => {
					this.setState({responseJson: responseJson});
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

		else {
			Alert.alert("Ops! :(",
						"Algo inesperado ocorreu no servidor. Tente novamente dentro de alguns instantes, por favor!");
		}

	}

	_treatResponseContent() {
		try {
			console.log("treatResponseContent");
			this.setState({nome:       this.state.responseJson["nome"]});
			this.setState({email:      this.props.authState.email});
			this.setState({nascimento: this.state.responseJson["nascimento"]});
			this.setState({telefone:   this.state.responseJson["telefone"]});
			this.setState({endereco:   this.state.responseJson["endereco"]});
			this.setState({cidade:     this.state.responseJson["cidade"]});
			this.setState({cep:        this.state.responseJson["cep"]});
			this.setState({imagem:     this.state.responseJson["imagem"]});
		}
		catch(error) {
			console.log("error: " + error);
		}
	}

	_getGeoPosition() {
		navigator.geolocation.getCurrentPosition(
      		(position) => {
        		var currentPosition = JSON.stringify(position);
        		this.setState({currentPosition});
      		},
      		(error) => alert(JSON.stringify(error)),
      			{enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    	);
    	Alert.alert("Posição atual", this.state.currentPosition);
	}
}