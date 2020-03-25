'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
	Text,
	View,
	TouchableOpacity,
	Image,
	ViewPropTypes
} from 'react-native';
import { Icon } from "native-base"

import styles from './VirtualKeyboard.style';

class VirtualKeyboard extends Component {

	static propTypes = {
		pressMode: PropTypes.oneOf(['string', 'char']),
		color: PropTypes.string,
		onPress: PropTypes.func.isRequired,
		backspaceImg: PropTypes.number,
		applyBackspaceTint: PropTypes.bool,
		decimal: PropTypes.bool,
		rowStyle: ViewPropTypes.style,
		cellStyle: ViewPropTypes.style
	}

	static defaultProps = {
		pressMode: 'string',
		color: 'gray',
		backspaceImg: require('./backspace.png'),
		applyBackspaceTint: true,
		decimal: false,
	}

	constructor(props) {
		super(props);
		this.state = {
			text: '',
		};
		
		this.lastPress = 0;
	}

	componentDidMount() {
		this.props.onRef(this)
	  }
	  componentWillUnmount() {
		this.props.onRef(undefined)
	  }

	render() {
		return (
			<View style={[styles.container, this.props.style]}>
				{this.Row([1, 2, 3])}
				{this.Row([4, 5, 6])}
				{this.Row([7, 8, 9])}
				<View style={[styles.row, this.props.rowStyle]}>
					{this.props.hasLeft ? this.LeftCell(this.props.leftText) : <View style={{ flex: 1 }} /> }
					{this.Cell(0)}
					{this.rightButton()}
				</View>
			</View>
		);
	}

	resetText = () =>{
		this.setState({
			text : ''
		})
	}	


	rightButton() {
		return (
			<TouchableOpacity accessibilityLabel='backspace' style={[styles.backspace,this.props.cellStyle]} onPress={this.props.onRightButtonClick}>
				{/* <Image source={this.props.backspaceImg} resizeMode='contain' style={this.props.applyBackspaceTint && ({ tintColor: this.props.color })} /> */}
				<Icon style={[styles.number, { color: this.props.color },this.props.rightStyle]} name={this.props.rightIconName || "backspace"} type={this.props.rightIconType || "MaterialIcons"}/>
			</TouchableOpacity>
		);
	}

	Row(numbersArray) {
		let cells = numbersArray.map((val) => this.Cell(val));
		return (
			<View style={[styles.row, this.props.rowStyle]}>
				{cells}
			</View>
		);
	}

	LeftCell(symbol) {
		return (
			<TouchableOpacity onLongPress={this.props.leftDoubleClick}  style={[styles.cell, this.props.cellStyle]} key={symbol} accessibilityLabel={symbol.toString()} onPress={() => { this.onPress(symbol.toString()) }}>
				<Text style={[styles.number, this.props.textStyle, { color: this.props.color }]}>{symbol}</Text>
			</TouchableOpacity>
		);
	}

	Cell(symbol) {
		return (
			<TouchableOpacity style={[styles.cell, this.props.cellStyle]} key={symbol} accessibilityLabel={symbol.toString()} onPress={() => { this.onPress(symbol.toString()) }}>
				<Text style={[styles.number, this.props.textStyle, { color: this.props.color }]}>{symbol}</Text>
			</TouchableOpacity>
		);
	}

	onDoublePress = () => {
		const time = new Date().getTime();
		const delta = time - this.lastPress;

		const DOUBLE_PRESS_DELAY = this.props.delayPress || 300;
		if (delta < DOUBLE_PRESS_DELAY) {
			this.lastPress = time;
			return true;
		}else{
			this.lastPress = time;
			return false;
		}
		
	
	};


	onPress(val) {
		if (this.props.pressMode === 'string') {
			let curText = this.state.text;
			if (isNaN(val)) {
				if (val === 'back') {
					curText = curText.slice(0, -1);
				} else if(val.toLowerCase() === 'clear'){
					const isDoublePress = this.onDoublePress();
					if(isDoublePress){
						this.props.leftDoubleClick();
						return;
					}else{
						curText = '';
					}
				
				}else{
					curText += val;
				}
			} else {
				curText += val;
			}
			console.log('key Text', curText)
			this.setState({ text: curText });
			this.props.onPress(curText);
		} else /* if (props.pressMode == 'char')*/ {
			this.props.onPress(val);
		}
	}
}


module.exports = VirtualKeyboard;
