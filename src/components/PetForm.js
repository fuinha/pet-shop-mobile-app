import React from 'react';
import { Alert, DatePickerAndroid, ScrollView, Picker, StyleSheet, Text, TextInput, View, Image } from 'react-native';
import { Container, Header, Title, Content, List, ListItem, InputGroup, Input, Footer, FooterTab, Button } from 'native-base';
import Cloudinary from 'cloudinary-core';
import ModalPicker from 'react-native-modal-picker';

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

	componentWillUnmount() {
		this.props.onUnmount();
	}

	render() {

		return(

			<Container>
				<Header style={styles.header}>
						<Title style={styles.title}>Novo Pet</Title>
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
					<Button rounded bordered block style={styles.btSalvar} onPress={() => this._pushData()}>Salvar</Button>
					<Button rounded bordered block style={styles.btVoltar} onPress={() => this._goToView("PetProfile", "")}>Voltar</Button>

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
		//this.props.navigator.push(
		//	{name: viewName,
		//	 state: viewState}
		//)
		this.props.navigator.pop();
	}

	_pushData() {

		fetch("http://192.168.0.103:3000/api/v1/newPet",
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