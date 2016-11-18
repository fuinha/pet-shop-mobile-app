import React from 'react';
import { Alert, DatePickerAndroid, Picker, Item, ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import { Container, Header, Content, List, ListItem, InputGroup, Input, Footer, FooterTab, Button } from 'native-base';
import Cloudinary from 'cloudinary-core';

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
					<Text>O Boticão - Adicionar Pet</Text>
				</Header>
				<Content>
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
									onFocus={() => this._showDataPicker()}									
								/>
							</InputGroup>
						</ListItem>
						<ListItem>
							<Picker
								selectedValue={this.state.raca}
								onValueChange={(raca) => this.setState({raca: raca})}>

								<Picker.Item label="Raça" value="null" />
								<Picker.Item label="Pastor Alemão" value="Pastor Alemão" />
								<Picker.Item label="Collie" value="Collie" />
								<Picker.Item label="Pug" value="Pug" />
								<Picker.Item label="Shih Tzu" value="Shih Tzu" />
								<Picker.Item label="Lhasa Apso" value="Lhasa Apso" />

							</Picker>
						</ListItem>
						<ListItem>
							<Picker
								selectedValue={this.state.porte}
								onValueChange={(porte) => this.setState({porte: porte})}>

								<Picker.Item label="Porte" value="null" />
								<Picker.Item label="Mini" value="Mini" />
								<Picker.Item label="Pequeno" value="Pequeno" />
								<Picker.Item label="Médio" value="Médio" />
								<Picker.Item label="Grande" value="Grande" />
								<Picker.Item label="Gigante" value="Gigante" />

							</Picker>							
						</ListItem>
					</List>

					<Button onPress={() => this._pushData()}>Salvar</Button>

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

	_goToView(viewName, viewState) {
		this.props.navigator.push(
			{name: viewName,
			 state: viewState}
		)
	}

	_pushData() {

		fetch("http://192.168.0.101:3000/api/v1/newPet",
			{
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					nome: this.state.nome,
					nascimento: this.state.nascimento,
					raca: this.state.raca,
					porte: this.state.porte,
					clienteEmail: this.props.authState.email
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
		if(this.state.responseStatus == "201") {
			console.log("analyzeResponse");
			Alert.alert("Sucesso!",
						"Seu amigo foi adicionado!",
						[{text: "Ok", onPress: () => this._goToView('PetProfile', this.props.authState) }]);
		}

		else {
			Alert.alert("Ops! :(",
						"Algo inesperado ocorreu no servidor. Tente novamente em alguns minutos, por favor!");
		}

	}

	_treatResponseContent() {

	}
}