import React from 'react';
import { Alert, AsyncStorage, ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import { Container, Header, Title, Content, List, ListItem, InputGroup, Input, Footer, FooterTab, Button, Icon } from 'native-base';
import { GLOBAL } from './GLOBAL.js';
import AppActivityIndicator from './AppActivityIndicator.js';

export default class ScheduleDetail extends React.Component {

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
			currentPosition: "",
			animating: true
		};
	}

	componentWillMount() {
		this._fetchData();
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
								<Title style={styles.title}>Agendamento</Title>
							</View>
						</View>
					</Header>
					<Content style={styles.content}>
				
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
					<AppActivityIndicator animating = {this.state.animating} />
					<Button onPress={() => this._fetchData()}>Baixar</Button>
					<Button onPress={() => this._getGeoPosition()}>Posição</Button>

				</Content>
				<Footer>
					<FooterTab>
						<Button bordered onPress={() => this._goToView("ClientProfile", this.props.authState)}>
							Eu
							<Icon name="user" />
						</Button>
						<Button bordered onPress={() => this._goToView("PetProfile", this.props.authState)}>
							Pets
							<Icon name="paw" />
						</Button>
						<Button bordered onPress={() => this._goToView("ServiceCategories", this.props.authState)}>
							Serviços
							<Icon name="list" />
						</Button>
						<Button bordered onPress={() => this._goToView("ScheduleList", this.props.authState)}>
							Agenda
							<Icon name="calendar" />
						</Button>
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

	_returnView() {
		this.props.navigator.pop();
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

		fetch(GLOBAL.BASE_URL + "/api/v1/clientProfile?email=" + this.props.authState.email + "&token=" + this.props.authState.token,
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

const styles = StyleSheet.create( {
	backgroundImage: {
		flex: 1
	},
	header: {
		backgroundColor: "#f0f0f0",
		paddingLeft: 15,
		paddingRight: 15
	},
	title: {
		color: "#6d6e70",
		justifyContent: "center"
	},
	content: {
		backgroundColor: 'rgba(255,255,255,0.6)'	
	}
});