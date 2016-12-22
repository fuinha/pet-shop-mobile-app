import React from 'react';
import { Alert, DatePickerAndroid, ScrollView, Picker, StyleSheet, Text, TextInput, View, Image } from 'react-native';
import { Container, Header, Title, Content, List, ListItem, InputGroup, Input, Footer, FooterTab, Button, Icon } from 'native-base';
import { GLOBAL } from './GLOBAL.js';
import AppActivityIndicator from './AppActivityIndicator.js';
import Cloudinary from 'cloudinary-core';

export default class PetForm extends React.Component {

	constructor() {
		super();
		this.state = {
			nome: "",
			nascimento: "",
			raca: "",
			porte: "",
			imagem: "",
			selectedEspecie: [],
			especies: [],
			animating: false
		};

	}

	componentWillMount() {
		this._fetchEspecieData();
	}

	componentWillUnmount() {
		this.props.onUnmount();
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
								<Title style={styles.title}>Novo Pet</Title>
							</View>
						</View>
					</Header>
					<Content style={styles.content}>
					<Image src={this.state.imagem}></Image>
					
					<List style={{ margin: 10, marginLeft: 20, marginRight: 20, borderWidth: 1, borderColor: "#c0c1c4", borderRadius: 4}}>
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

						
					</List>
					<View style={{ margin: 10, borderWidth: 1, borderColor: "#c0c1c4", borderRadius: 4, marginLeft: 20, marginRight: 20 }}>
						<Picker
							style={{marginLeft: 20, marginRight: 20}}
							selectedValue={this.state.selectedEspecie[0]}
							onValueChange={(especieValue, especiePosition) => {

								var especie = new Array(especieValue, this.state.especies[especiePosition][1]);

								this.setState({selectedEspecie: especie});							

							}}>

							{this.state.especies.map((especie) => {return <Picker.Item key={especie[0]} label={especie[1]} value={especie[0]} />})}

						</Picker>
					</View>							
						<View style={{ margin: 10, borderWidth: 1, borderColor: "#c0c1c4", borderRadius: 4, marginLeft: 20, marginRight: 20 }}>
							<Picker
								style={{marginLeft: 20, marginRight: 20}}
								selectedValue={this.state.raca}
								onValueChange={(raca) => this._pickerFunc(raca)}>

								<Picker.Item label="- Raça -" value="null" />
								<Picker.Item label="Pastor Alemão" value="Pastor Alemão" />
								<Picker.Item label="Collie" value="Collie" />
								<Picker.Item label="Pug" value="Pug" />
								<Picker.Item label="Shih Tzu" value="Shih Tzu" />
								<Picker.Item label="Lhasa Apso" value="Lhasa Apso" />

							</Picker>
						</View>
						<View style={{ margin: 10, borderWidth: 1, borderColor: "#c0c1c4", borderRadius: 4, marginLeft: 20, marginRight: 20 }}>
							<Picker
								style={{marginLeft: 20, marginRight: 20}}
								selectedValue={this.state.porte}
								onValueChange={(porte) => this.setState({porte: porte})}>

								<Picker.Item label="- Porte -" value="null" />
								<Picker.Item label="Mini" value="Mini" />
								<Picker.Item label="Pequeno" value="Pequeno" />
								<Picker.Item label="Médio" value="Médio" />
								<Picker.Item label="Grande" value="Grande" />
								<Picker.Item label="Gigante" value="Gigante" />

							</Picker>
						</View>
					<AppActivityIndicator animating = {this.state.animating} />
					<Button rounded bordered block style={styles.btSalvar} onPress={() => this._pushData()}>Salvar</Button>

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

	_pickerFunc(raca) {
		this.setState({raca: raca});
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

	_fetchEspecieData() {

		console.log("_fetchEspecieData");

		this.setState({animating: true});

		fetch(GLOBAL.BASE_URL + "/api/v1/especies",
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
					this._analyzeEspecieResponse();
				}
			)
			.catch((error) => console.error(error));
	}

	_analyzeEspecieResponse() {
		if(this.state.responseStatus == "200") {
			this._treatEspecieResponseContent();
		}

		else {
			Alert.alert("Ops! :(",
						"Algo inesperado ocorreu no servidor. Tente novamente em alguns minutos, por favor!");
		}

	}

	_treatEspecieResponseContent() {
		try {
			console.log("treatResponseContent");
			var listItems = new Array();
			var index = 0;
			for(var key in this.state.responseJson) {
				listItems[index] = new Array(key, this.state.responseJson[key]["descricao"]);
				index = index + 1;
			}

			listItems.unshift([0, "- Espécie -"]);

			this.setState({animating: false});

			this.setState({especies:  listItems});
		}
		catch(error) {
			console.log("error: " + error);
		}
	}

	_pushData() {

		this.setState({animating: true});

		fetch(GLOBAL.BASE_URL + "/api/v1/newPet",
			{
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					nome: this.state.nome,
					nascimento: this.state.nascimento,
					especie_id: this.state.selectedEspecie[0],
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
			this.setState({animating: false});
			Alert.alert("Sucesso!",
						"Seu amigo foi adicionado!",
						[{text: "Ok", onPress: () => this._goToView('PetProfile', this.props.authState) }]);
		}

		else {
			Alert.alert("Ops! :(",
						"Algo inesperado ocorreu no servidor. Tente novamente em alguns minutos, por favor!");
		}

	}

}

const styles = StyleSheet.create( {
	backgroundImage: {
		flex: 1
	},
	header: {
		backgroundColor: "#f0f0f0"
	},
	title: {
		color: "#6d6e70"
	},
	content: {
		backgroundColor: 'rgba(255,255,255,0.6)'	
	},
	picker: {
		borderColor: "#fff",
		flexDirection: "row",
		justifyContent: "flex-start"
	},
	optionText: {

	},
	btSalvar: {
    	margin: 20,
    	marginTop: 10,
    	marginBottom: 5
  	},
  	btVoltar: {
  		margin: 20,
  		marginTop: 10,
    	marginBottom: 5
  	}
});