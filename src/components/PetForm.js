import React from 'react';
import { ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import { Container, Header, Content, List, ListItem, InputGroup, Input, Footer, FooterTab, Button } from 'native-base';

export default class PetForm extends React.Component {

	constructor() {
		super();
		this.state = {
			nome: "",
			nascimento: "",
			raca: "",
			porte: "",
			imagem: ""
		};

	}

	render() {
		return(

			<Container>
				<Header>
					<Text>O Boticão - Pet Profile</Text>
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
									ref="nascimento"
									value={this.state.nascimento}
								/>
							</InputGroup>
						</ListItem>
						<ListItem>
							<InputGroup disabled>
								<Input
									ref="raca"
									value={this.state.raca}
								/>
							</InputGroup>
						</ListItem>
						<ListItem>
							<InputGroup disabled>
								<Input
									ref="porte"
									value={this.state.porte}
								/>
							</InputGroup>
						</ListItem>
						
					</List>
					<Button onPress={() => this._fetchData()}>Verificar token</Button>

				</Content>
				<Footer>
					<FooterTab>
						<Button onPress={() => this._goToView("ClientProfile")}>Eu</Button>
					
						<Button onPress={() => this._goToView("PetProfile")}>Pets</Button>
					
						<Button onPress={() => this._goToView("ServiceCategories", "")}>Serviços</Button>
					
						<Button onPress={() => this._goToView("Schedule")}>Agenda</Button>
					</FooterTab>
				</Footer>     			
      		</Container>
		)
	}

	_goToView(viewName) {
		this.props.navigator.push(
			{name: viewName}
		)
	}

	_fetchData() {

		fetch("http://192.168.0.101:3000/api/v1/newPet",
			{
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					
				})
			})
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
		if(this.state.responseStatus == "200") {
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
			var listItems = new Array();
			var index = 0;
			for(var key in this.state.responseJson) {
				listItems[index] = new Array(key, this.state.responseJson[key]["descricao"], this.state.responseJson[key]["imagem"]);
				console.log(key + " - " + this.state.responseJson[key]["descricao"] + " - " + this.state.responseJson[key]["imagem"])
				index = index + 1;
			}

			this.setState({listItems:  listItems});
		}
		catch(error) {
			console.log("error: " + error);
		}
	}
}