let dataTable;
let data = '';
let output = 0;

let baseTest1 = [1,0,0,0,99];
let baseTest2 = [2,3,0,3,99];
let baseTest3 = [2,4,4,5,99,0];
let baseTest4 = [1,1,1,4,99,5,6,0,99];
let baseTest5 = [3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9];
let baseTest6 = [];
let baseTest7 = [];

let testData1 = [3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0];
let testData2 = [3,23,3,24,1002,24,10,24,1002,23,-1,23,101,5,23,23,1,24,23,23,4,23,99,0,0];
let testData3 = [3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0];

let testDataP201 = [3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5];
let testDataP202 = [3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10];

data =
  '3,8,1001,8,10,8,105,1,0,0,21,38,47,64,85,106,187,268,349,430,99999,3,9,1002,9,4,9,1001,9,4,9,1002,9,4,9,4,9,99,3,9,1002,9,4,9,4,9,99,3,9,1001,9,3,9,102,5,9,9,1001,9,5,9,4,9,99,3,9,101,3,9,9,102,5,9,9,1001,9,4,9,102,4,9,9,4,9,99,3,9,1002,9,3,9,101,2,9,9,102,4,9,9,101,2,9,9,4,9,99,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,99,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,2,9,9,4,9,3,9,101,1,9,9,4,9,99,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,101,1,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,99,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,99,3,9,1002,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,102,2,9,9,4,9,99';

class Computer {

  constructor(memBank = [99], autoStart = true, debug = false)
  {
    this.debug = debug;
    this.memBank = memBank;
    this.autoStart = autoStart;

    this.opCodes = {
      1: {label: 'ADD', vars: 3},
      2: {label: 'MPLY', vars: 3},
      3: {label: 'INP', vars: 1},
      4: {label: 'OUT', vars: 1},
      5: {label: 'JUTR', vars: 2},
      6: {label: 'JUFA', vars: 2},
      7: {label: 'JULE', vars: 3},
      8: {label: 'JUGR', vars: 3},
      99: {label: 'STOP', vars: 0}
    };

    this.index = 0;
    this.running = false;
    this.currentOperand = 99;
    this.outputData = 0;
    this.mode = Array(3).fill(0);
    this.value = Array(3).fill(0);
    this.address = Array(3).fill(0);
    this.inputAddress = -1;
    this.pauseTxt = '';

    if (this.autoStart === true)
    {
      this.runComputer();
    }
  }

  receiveInput(input)
  {
    this.memBank[this.inputAddress] = input;
    if (this.debug)
    {
      console.info("INPUT: "+input+" >> ["+this.inputAddress+"]");
    }
    this.runComputer();
  }

  decodeOpcode()
  {
    let opCode = (""+this.memBank[this.index]).split("").map((x)=>{return +x;});

    while (opCode.length < 5)
    {
      opCode.unshift(0);
    }

    this.address.fill(-1);
    this.value.fill(0);
    this.mode = [opCode[2], opCode[1], opCode[0]];

    let operand = +(opCode[3]+""+opCode[4]);

    let knowOperand = Object.keys(this.opCodes).map((x) => { return +x; }).some((x) => { return x === operand });

    if (!knowOperand)
    {
      if (this.debug)
      {
        console.error("UNKNOWN OPERAND");
      }
      this.pauseTxt = 'ERROR: UNKNOWN OPERAND';
      this.running = false;
      return false;
    }

    this.currentOperand = operand;

    for (let index = 0; index < this.opCodes[operand].vars; index++) {
      if (this.mode[index] === 1)
      {
        this.value[index] = this.memBank[this.index + 1 + index];
        this.address[index] = this.index + 1 + index;
      } 
      else
      {
        this.address[index] = this.memBank[this.index + 1 + index];
        this.value[index] = this.memBank[this.address[index]];
      }     
    }

    if (this.debug)
    {
      console.info("OPERAND: "+operand+" - MODES: "+this.mode+" - VALUES: "+this.value+" - ADDRESSES: "+this.address);
    }

    return true;
  }

  runOperation()
  {
    let log = '';
    let continu = true;
    let result = -1;
    let jump = false;
    switch (this.currentOperand)
    {
      case 1:
        result = this.value[0] + this.value[1];
        this.memBank[this.address[2]] = result;
        log = this.opCodes[this.currentOperand].label+" - ["+this.value[0]+","+this.value[1]+"] > ("+this.address[2]+")";
        break;
      case 2:
        result = this.value[0] * this.value[1];
        this.memBank[this.address[2]] = result;
        log = this.opCodes[this.currentOperand].label+" - ["+this.value[0]+","+this.value[1]+"] > ("+this.address[2]+")";
        break;
      case 3:
        this.pauseTxt = "AWAIT INPUT";
        this.inputAddress = this.address[0];
        log = this.opCodes[this.currentOperand].label+" @ "+this.inputAddress;
        continu = false;
        break;
      case 4:
        this.outputData = this.value[0];
        log = this.opCodes[this.currentOperand].label+" >> "+this.outputData;
        break;
      case 5:
        if (this.value[0]!==0)
        {
          this.index = this.value[1];
          jump = true;
        }
        log = this.opCodes[this.currentOperand].label+" }} "+this.index+" ?"+jump+"?";
        break;
      case 6:
        if (this.value[0]===0)
        {
          this.index = this.value[1];
          jump = true;
        }
        log = this.opCodes[this.currentOperand].label+" }} "+this.index+" ?"+jump+"?";
        break;
      case 7:
        result = (this.value[0] < this.value[1])?1:0;
        this.memBank[this.address[2]] = result;
        log = this.opCodes[this.currentOperand].label+" - ["+this.value[0]+","+this.value[1]+"] > ("+this.address[2]+")";
        break;
      case 8:
        result = (this.value[0] === this.value[1])?1:0;
        this.memBank[this.address[2]] = result;
        log = this.opCodes[this.currentOperand].label+" - ["+this.value[0]+","+this.value[1]+"] > ("+this.address[2]+")";
        break;
      case 99:
        log = this.opCodes[this.currentOperand].label;
        this.running = false;
        continu = false;
        break;
      default:
        break;
    }

    if (this.debug)
    {
      console.info(log);
    }

    if (!jump)
    {
      this.index += this.opCodes[this.currentOperand].vars+1;
    }
    return continu;
  }

  runComputer()
  {
    if (this.memBank.length < 1)
    {
      if (this.debug)
      {
        console.error("EMPTY MEMORY BANK");
      }
      this.pauseTxt = 'ERROR: EMPTY MEMORY BANK';
      return;
    }

    let active = true;
    this.running = true;

    while (active)
    {
      let opCodeValid = this.decodeOpcode();
      if (!opCodeValid)
      {
        break;
      }
      active = this.runOperation();
    }
  }

  drawMemBank()
  {
    console.log(this.memBank);
  }

  showOutput()
  {
    console.log(this.outputData);
  }
}

function permutate(cnt, arr)
{
  if (cnt === 1)
  {
    inputVals.push([...arr]);
    return;
  }

  for (let index = 0; index < cnt; index++) {
    permutate(cnt-1, arr);

    if (cnt%2 === 0)
    {
      arraySwap(arr, index, cnt - 1);
    }
    else
    {
      arraySwap(arr, 0, cnt - 1);
    }
  }

  function arraySwap(arr, idxStart, idxEnd)
  {
    let temp = arr[idxStart];
    arr[idxStart] = arr[idxEnd];
    arr[idxEnd] = temp;
  }
}

dataTable = data.split(",").map((x)=>{return +x;});

let inputVals = [];
let maxThrust = -1;
let accSignal = [];
const AMPCNT = 5
let amplifiers = Array(AMPCNT);

permutate(5,[0,1,2,3,4]);

inputVals.map(function (permutation, idx)
{
  let result = 0;
  for (let index = 0; index < AMPCNT; index++) {
    amplifiers[index] = new Computer([...dataTable]);
    amplifiers[index].receiveInput(permutation[index]);
    amplifiers[index].receiveInput(result);
    result = amplifiers[index].outputData;
  }

  if (result > maxThrust)
  {
    maxThrust = result;
    accSignal = permutation;
  }
});

console.log("ST1 ~ MaxThrust: "+maxThrust+" - signal: "+accSignal);

inputVals = [];
maxThrust = 0;
accSignal = [];
permutate(5,[5,6,7,8,9]);

inputVals.map(function (permutation, idx)
{
  let result = 0;
  for (let index = 0; index < AMPCNT; index++) {
    amplifiers[index] = new Computer([...dataTable]);
    amplifiers[index].receiveInput(permutation[index]);
    amplifiers[index].receiveInput(result);
    result = amplifiers[index].outputData;
  }

  if (amplifiers[4].running)
  {
    let feedbackLoop = true;
    while (feedbackLoop)
    {
      for (let index = 0; index < AMPCNT; index++) {
        amplifiers[index].receiveInput(result);
        result = amplifiers[index].outputData;
      }
      feedbackLoop = amplifiers[4].running;
    }
  }

  if (result > maxThrust)
  {
    maxThrust = result;
    accSignal = permutation;
  }
});

console.log("ST2 ~ MaxThrust: "+maxThrust+" - signal: "+accSignal);