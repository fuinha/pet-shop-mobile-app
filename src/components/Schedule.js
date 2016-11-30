import React from 'react';
import { Alert, StyleSheet, Picker, Text, TextInput, View, Image, DatePickerAndroid } from 'react-native';
import { Container, Header, Title, Content, List, ListItem, Input, InputGroup, CheckBox, Footer, FooterTab, Button } from 'native-base';

export default class Schedule extends React.Component {

	constructor() {
		super();
		this.state = {
			day: "",
			selectedHour: [],
			availableHours: [],
			petsByClient: [],
			selectedPet: [],
			servicesByEspecies: [],
			selectedService: [],
			taxiDog: false,
			obs: "",
			value: {v: 0, lineStyle: {}, textStyle: {color: "#fff"}}
		};
	}

	componentWillMount() {
		this._fetchPetData();
	}

	render() {
		return(

			<Container>
				<Header style={styles.header}>
					<Title style={styles.title}>Agendamento</Title>
				</Header>
				<Content style={styles.content}>

					<View style={{ margin: 5, marginTop: 10, borderWidth: 1, borderColor: "#c0c1c4", borderRadius: 4, marginLeft: 20, marginRight: 20 }}>

						<Picker
							style={{marginLeft: 20, marginRight: 20}}
							selectedValue={this.state.selectedPet[0]}
							onValueChange={(petValue, petPosition) => {

								var pet = new Array(petValue, this.state.petsByClient[petPosition][2]);

								this.setState({selectedPet: pet}, () => this._fetchServiceData());							

							}}>

							{this.state.petsByClient.map((pet) => {return <Picker.Item key={pet[0]} label={pet[1]} value={pet[0]} />})}

						</Picker>
					</View>
					<View style={{ margin: 5, borderWidth: 1, borderColor: "#c0c1c4", borderRadius: 4, marginLeft: 20, marginRight: 20 }}>
						<Picker
							style={{marginLeft: 20, marginRight: 20}}
							selectedValue={this.state.selectedService[0]}
							onValueChange={(serviceValue, servicePosition) => {

								var service = new Array(serviceValue, this.state.servicesByEspecies[servicePosition][2], this.state.servicesByEspecies[servicePosition][3]);
								this.setState({selectedService: service});

								console.log("Picker servicesByEspecies value: " + this.state.servicesByEspecies[servicePosition][2]);

								var values = {v: this.state.servicesByEspecies[servicePosition][2],null,null};

								console.log("Picker values: " + values.v);

							}}>

							{ 
								!this.state.selectedPet[0] ?
								<Picker.Item key="0" label="- Qual serviço? -" value="0" />
								:this.state.servicesByEspecies.map((service) => {return <Picker.Item key={service[0]} label={service[1]} value={service[0]} />})
								
							}

						</Picker>						
					</View>

					<View style={{ margin: 5, marginLeft: 20, marginRight: 20, paddingLeft: 25, borderWidth: 1, borderColor: "#c0c1c4", borderRadius: 4}}>
					<Input
						style={{fontSize: 16}}
						ref="dia"
						placeholder="Qual dia?"
						value={this.state.day}
						onFocus={() => this._showDataPicker()}
					/>
					</View>

					<View style={{ margin: 5, borderWidth: 1, borderColor: "#c0c1c4", borderRadius: 4, marginLeft: 20, marginRight: 20 }}>
						<Picker
							style={{marginLeft: 20, marginRight: 20}}
							selectedValue={this.state.selectedHour[0]}
							onValueChange={(hourValue, hourPosition) => {

								var hour = new Array(hourValue, this.state.availableHours[hourPosition][2], this.state.availableHours[hourPosition][3]);
								this.setState({selectedHour: hour});

							}}>

							{ !this.state.selectedService[0] ?
								<Picker.Item key="0" label="- Qual horário? -" value="0" />
								:this.state.availableHours.map((hour) => {return <Picker.Item key={hour[0]} label={hour[1]} value={hour[0]} />})
							}

						</Picker>						
					</View>


					<List style={{ margin: 5, marginLeft: 20, marginRight: 20, paddingLeft: 10, borderWidth: 1, borderColor: "#c0c1c4", borderRadius: 4}}>
						<ListItem onPress={() => this._taxiDogCheckBox()} >
							<CheckBox ref="taxidog" checked={this.state.taxiDog} onPress={() => this._taxiDogCheckBox()} />
							<Text style={{fontSize: 16}}>Utiliza Táxi Dog?</Text>
						</ListItem>
					</List>

					<View style={{ margin: 5, marginLeft: 20, marginRight: 20, paddingLeft: 25, borderWidth: 1, borderColor: "#c0c1c4", borderRadius: 4}}>
					<TextInput
						style={{fontSize: 16}}
						ref="obs"
						maxLength={30}
						placeholder="Observações gerais"
						onChangeText={(text) => this.setState({obs: text})}
						value={this.state.obs}

					/>
					</View>

					<View style={this.state.value.lineStyle}>
							<Text style={this.state.value.textStyle}>Valor: R$ {this.state.value.v} (já incluso táxi dog: R$ 15)"</Text>
					</View>

					{ 
						this.state.value[0] ?
						this._valueLineStyle("true")
						:this._valueLineStyle("false")
					}
					
					<Button rounded bordered block style={styles.btSalvar} onPress={() => this._pickerFunc()}>Agendar</Button>

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

	_valueLineStyle(isValueSetted) {
		if(!isValueSetted) {
			var values = {null,
						lineStyle: {borderWidth: 1, borderColor: "#6098f2"},
						textStyle: {color: "#6098f2"}};
			this.setState({value: values});
		}
		
	}

	_taxiDogCheckBox() {
		this.setState({taxiDog: !this.state.taxiDog});
		//this.setState({value: this.state.value + 15});
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

				this.setState({ day: dateReturn.day + "/" + dateReturn.month + "/" + dateReturn.year});
			}
		}
		catch ({code, message}) {
			console.warn("Cannot open date picker", message);
		}
		this.refs.taxidog._textInput.focus();
	}

	_goToView(viewName, viewState) {
		this.props.navigator.push(
			{name: viewName,
			 state: viewState}
		)
	}

	_fetchPetData() {

		fetch("http://192.168.0.103:3000/api/v1/petsByClient?clientEmail=" + this.props.authState.email,
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
					this._analyzeFetchPetResponse();
				}
			)
			.catch((error) => console.error(error));
	}

	_analyzeFetchPetResponse() {
		if(this.state.responseStatus == "200") {
			this._treatFetchPetResponseContent();
		}

		else {
			Alert.alert("Ops! :(",
						"Algo inesperado ocorreu no servidor. Tente novamente em alguns minutos, por favor!");
		}

	}

	_treatFetchPetResponseContent() {
		try {
			console.log("treatResponseContent");
			var listItems = new Array();
			var index = 0;
			for(var key in this.state.responseJson) {
				listItems[index] = new Array(key, this.state.responseJson[key]["nome"], this.state.responseJson[key]["especie_id"]);
				index = index + 1;
			}

			console.log("Before unshift: " + listItems);

			listItems.unshift([0, "- Para qual pet? -"]);

			console.log("After unshift: " + listItems);

			this.setState({petsByClient:  listItems});

			console.log("PetsByClient: " + this.state.petsByClient);
		}
		catch(error) {
			console.log("error: " + error);
		}
	}

	_fetchServiceData() {

		fetch("http://192.168.0.103:3000/api/v1/servicesByEspecies?especiesId=" + this.state.selectedPet[1],
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
					this._analyzeFetchServiceResponse();
				}
			)
			.catch((error) => console.error(error));
	}

	_analyzeFetchServiceResponse() {
		if(this.state.responseStatus == "200") {
			this._treatFetchServiceResponseContent();
		}

		else {
			Alert.alert("Ops! :(",
						"Algo inesperado ocorreu no servidor. Tente novamente em alguns minutos, por favor!");
		}

	}

	_treatFetchServiceResponseContent() {
		try {
			console.log("treatResponseContent");
			var listItems = new Array();
			var index = 0;
			for(var key in this.state.responseJson) {
				listItems[index] = new Array(key, this.state.responseJson[key]["descricao"], this.state.responseJson[key]["valor"], this.state.responseJson[key]["duracao"]);
				index = index + 1;
			}

			listItems.unshift([0, "- Qual serviço? -"]);

			this.setState({servicesByEspecies:  listItems});

			console.log("servicesByEspecies: " + this.state.servicesByEspecies);
		}
		catch(error) {
			console.log("error: " + error);
		}
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
    	margin: 20
  	}
});