class Computer {
	constructor(memBank = [99], autoStart = true, debug = false, input = []) {
		this.debug = debug;
		this.memBank = memBank;
		this.autoStart = autoStart;
		this.relativeBase = 0;
		this.inputArray = input;
		this.inputPos = 0;

		this.opCodes = {
			1: { label: 'ADD', vars: 3 },
			2: { label: 'MULTIPLY', vars: 3 },
			3: { label: 'INPUT', vars: 1 },
			4: { label: 'OUTPUT', vars: 1 },
			5: { label: 'JUMPNOTNILL', vars: 2 },
			6: { label: 'JUMPNILL', vars: 2 },
			7: { label: 'FLAGIFLESS', vars: 3 },
			8: { label: 'FLAGIFEQUAL', vars: 3 },
			9: { label: 'REBASE', vars: 1 },
			99: { label: 'STOP', vars: 0 }
		};

		this.index = 0;
		this.running = false;
		this.paused = false;
		this.currentOperand = 99;
		this.outputData = 0;
		this.outputArray = Array();
		this.mode = Array(3).fill(0);
		this.value = Array(3).fill(0);
		this.address = Array(3).fill(0);
		this.inputAddress = -1;
		this.pauseTxt = '';

		if (this.autoStart === true) {
			this.runComputer();
		}
	}

	setRelativeBase(base) {
		this.relativeBase = base;
		if (this.debug) {
			console.info('RELBASE: ' + base + ' >> [' + this.relativeBase + ']');
		}
	}

	receiveInput(input) {
		this.memBank[this.inputAddress] = input;
		if (this.debug) {
			console.info('INPUT: ' + input + ' >> [' + this.inputAddress + ']');
		}
		this.paused = false;
		this.runComputer();
	}

	decodeOpcode() {
		let opCode = ('' + this.memBank[this.index]).split('').map((x) => {
			return +x;
		});

		while (opCode.length < 5) {
			opCode.unshift(0);
		}

		this.address.fill(-1);
		this.value.fill(0);
		this.mode = [opCode[2], opCode[1], opCode[0]];

		let operand = +(opCode[3] + '' + opCode[4]);

		let knowOperand = Object.keys(this.opCodes)
			.map((x) => {
				return +x;
			})
			.some((x) => {
				return x === operand;
			});

		if (!knowOperand) {
			if (this.debug) {
				console.error('UNKNOWN OPERAND');
			}
			this.pauseTxt = 'ERROR: UNKNOWN OPERAND';
			this.running = false;
			return false;
		}

		this.currentOperand = operand;

		for (let index = 0; index < this.opCodes[operand].vars; index++) {
			if (this.mode[index] === 1) {
				this.value[index] = this.memBank[this.index + 1 + index];
				this.address[index] = this.index + 1 + index;
			} else if (this.mode[index] === 2) {
				this.address[index] = this.memBank[this.index + 1 + index] + this.relativeBase;
				this.value[index] = this.memBank[this.address[index]];
			} else {
				this.address[index] = this.memBank[this.index + 1 + index];
				this.value[index] = this.memBank[this.address[index]];
			}
		}

		if (this.debug) {
			console.info(
				'OPERAND: ' + operand + ' - MODES: ' + this.mode + ' - VALUES: ' + this.value + ' - ADDRESSES: ' + this.address
			);
		}

		return true;
	}

	runOperation() {
		let log = '';
		let continu = true;
		let result = -1;
		let jump = false;
		let fill = false;
		switch (this.currentOperand) {
			case 1:
				result = this.value[0] + this.value[1];
				if (this.address[2] > this.memBank.length) {
					fill = true;
				}
				this.memBank[this.address[2]] = result;
				log =
					this.opCodes[this.currentOperand].label +
					' - [' +
					this.value[0] +
					',' +
					this.value[1] +
					'] > (' +
					this.address[2] +
					')';
				break;
			case 2:
				result = this.value[0] * this.value[1];
				if (this.address[2] > this.memBank.length) {
					fill = true;
				}
				this.memBank[this.address[2]] = result;
				log =
					this.opCodes[this.currentOperand].label +
					' - [' +
					this.value[0] +
					',' +
					this.value[1] +
					'] > (' +
					this.address[2] +
					')';
				break;
			case 3:
				this.inputAddress = this.address[0];
				log = this.opCodes[this.currentOperand].label + ' @ ' + this.inputAddress;
				if (this.inputArray.length > 0 && this.inputArray[this.inputPos] !== 'undefined') {
					this.memBank[this.inputAddress] = this.inputArray[this.inputPos];
					this.inputPos++;
				} else {
					this.pauseTxt = 'AWAIT INPUT';
					this.paused = true;
					continu = false;
				}
				break;
			case 4:
				if (this.address[0] === -1) {
					this.outputArray = this.memBank;
					this.running = false;
				} else {
					this.outputData = this.value[0];
					this.outputArray.push(this.outputData);
				}
				log = this.opCodes[this.currentOperand].label + ' >> ' + this.outputData;
				break;
			case 5:
				if (this.value[0] !== 0) {
					this.index = this.value[1];
					jump = true;
				}
				log =
					this.opCodes[this.currentOperand].label +
					' - V: ' +
					this.value[0] +
					' [J: ' +
					jump +
					' - ' +
					this.value[1] +
					'] }} ' +
					this.index;
				break;
			case 6:
				if (this.value[0] === 0) {
					this.index = this.value[1];
					jump = true;
				}
				log =
					this.opCodes[this.currentOperand].label +
					' - V: ' +
					this.value[0] +
					' [J: ' +
					jump +
					' - ' +
					this.value[1] +
					'] }} ' +
					this.index;
				break;
			case 7:
				result = this.value[0] < this.value[1] ? 1 : 0;
				if (this.address[2] > this.memBank.length) {
					fill = true;
				}
				this.memBank[this.address[2]] = result;
				log =
					this.opCodes[this.currentOperand].label +
					' - [FL: ' +
					result +
					' - ' +
					this.value[0] +
					'<' +
					this.value[1] +
					'] > (' +
					this.address[2] +
					')';
				break;
			case 8:
				result = this.value[0] === this.value[1] ? 1 : 0;
				if (this.address[2] > this.memBank.length) {
					fill = true;
				}
				this.memBank[this.address[2]] = result;
				log =
					this.opCodes[this.currentOperand].label +
					' - [FL: ' +
					result +
					' - ' +
					this.value[0] +
					' === ' +
					this.value[1] +
					'] > (' +
					this.address[2] +
					')';
				break;
			case 9:
				this.relativeBase += this.value[0];
				log = this.opCodes[this.currentOperand].label + ' >> ' + this.relativeBase;
				break;
			case 99:
				log = this.opCodes[this.currentOperand].label;
				this.running = false;
				continu = false;
				break;
			default:
				break;
		}

		if (this.debug) {
			console.info(log);
			this.drawMemBank();
		}

		if (!jump) {
			this.index += this.opCodes[this.currentOperand].vars + 1;
		}

		if (fill) {
			this.fillEmptyMemory();
		}

		return continu;
	}

	runComputer() {
		if (this.memBank.length < 1) {
			if (this.debug) {
				console.error('EMPTY MEMORY BANK');
			}
			this.pauseTxt = 'ERROR: EMPTY MEMORY BANK';
			return;
		}

		let active = !this.paused;
		this.running = true;

		while (active) {
			let opCodeValid = this.decodeOpcode();
			if (!opCodeValid) {
				break;
			}
			active = this.runOperation();
			if (!active) {
				//console.log('PAUSED: ' + this.pauseTxt);
			}
		}
	}

	drawMemBank() {
		console.log([...this.memBank]);
	}

	showOutput() {
		console.log(this.outputData);
	}

	returnOutputValue() {
		let outputTemp = this.outputData;
		this.outputData = '';
		return outputTemp;
	}

	returnOutputArray() {
		let outputTemp = this.outputArray;
		this.outputArray = Array();
		return outputTemp;
	}

	fillEmptyMemory() {
		if (this.debug) {
			console.log('FILL EMPTY MEMORY');
		}

		for (let index = 0; index < this.memBank.length; index++) {
			if (this.memBank[index]) {
				continue;
			} else {
				this.memBank[index] = 0;
			}
		}
	}
}

//module.exports = Computer;
