import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Container, Header, Title, Content, Icon } from 'native-base';

export default class AppActivityIndicator extends React.Component {
	render() {
		return (
			<View>
				<ActivityIndicator animating = { this.props.animating } />
			</View>
		);
}
}