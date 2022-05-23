var i = 0; //current selection on MFD
var j = 1; //previous selection on MFD
var selector = 0; //something is selected on MFD
let avstate = [];
var powerstate = 0;
var timeout;
var cniPow;
var auxPow;
var icpState;
var enablestate = 0;

for (a = 0; a <= 9; a++) { 
    avstate[a] = new Array(0); 
} 

for (a = 1; a <= 9; a++) {
    avstate[a][0] = 0;
}
for (a = 1; a <= 9; a++) {
    avstate[a][1] = 0;
}
////////////////////////////////////////////////////////////////////////////////
function stateblank(b) {
    if (avstate[b][0] != -1) {
        document.getElementById(b + 'C').innerHTML = "&nbsp";
        avstate[b][0] = 0;
        autoOper(powerstate);
        regAll();
    }
}
function stateinit(b) {
    if (avstate[b][0] == 0 && powerstate > 0) {
        if ((b <= 3 || b >= 8) && powerstate == 1) {
            //do nothing
        } else {
        document.getElementById(b + 'C').innerHTML = "init";
        avstate[b][0] = 1;
        autoOper(powerstate);
        }
    }
}
function stateoper(b) {
    if (avstate[b][0] == 1 || avstate[b][0] == 3 && powerstate > 0) {
        if ((b <= 3 || b >= 8) && powerstate == 1) {
            //do nothing
        } else {
        document.getElementById(b + 'C').innerHTML = "oper";
        avstate[b][0] = 2;
        ibitCheck(j);
        autoOper(powerstate);
        }
    }
}
function stateoff(b) {
    if (avstate[b][0] == -1 && powerstate > 0) {
        document.getElementById(b + 'C').innerHTML = "off";
        regAll();
    }
}
function staterdy() {
    if (avstate[4][0] >= 1) {
        document.getElementById(4 + 'C').innerHTML = "rdy";
        avstate[4][0] = 3;
        autoOper(powerstate);
    }
}
function statepass(b) {
    if (((avstate[b][0] == 2) && (avstate[b][1] == 1)) || ((avstate[7][0] == 2) && (b == 7))) {
        document.getElementById(b + 'R').innerHTML = "pass";
        avstate[b][1] = 2;
        ibitCheck(j);
        setTimeout(passblank, 4000, b);
    }
}
function statefrc(b) {
    if (avstate[b][0] == 2) {
        document.getElementById(b + 'R').innerHTML = "frc";
        avstate[b][1] = 3;
        ibitCheck(j);
    }
}
function stateintest(b) {
    if (avstate[b][0] == 2 && avstate[b][1] == 0) {
        document.getElementById(b + 'R').innerHTML = "intest";
        avstate[b][1] = 1;
        setTimeout(statepass, 2000, b);
        ibitCheck(j);
    }
}
function stateblank2(b) {
    document.getElementById(b + 'R').innerHTML = "&nbsp";
    avstate[b][1] = 0;
    ibitCheck(j);
    if (b !== 7) {
        setTimeout(stateintest, 2000, b);
    } else {
        setTimeout(statepass, 4000, b);
    }
}
function passblank(b) {
    if (avstate[b][1] == 2 && b <= 6) {
        document.getElementById(b + 'R').innerHTML = "&nbsp";
    }
}
function reset() {
    if (selector == 1) {
        invReset();
        setTimeout(stateblank, 1000, j);
        avstate[j][0] = 0;
        stopibit();
        autoOff();
    }
}
function off() {
    if (selector == 1) {
        invOff();
        setTimeout(stateoff, 1000, j);
        avstate[j][0] = -1;
        stopibit();
        autoOff();
    }
}
function oper() {
    if (selector == 1 && avstate[j][0] == -1) {
        invOper();
        setTimeout(stateblank, 1000, j);
        avstate[j][0] = 0;
        autoOper(powerstate);
    }
}
function startibit() {
    if (selector == 1 && avstate[j][0] == 2) {
        stateblank2(j);
        document.getElementById("startibit").style.color = "black";
        document.getElementById("startibit").style.backgroundColor = "lawngreen";
        document.getElementById("startibit").style.width = "45%";
    }
}
function stopibit() {
    if (j !== 5 && j !== 6 && j !== 9) {
        document.getElementById(j + 'R').innerHTML = "&nbsp";
        avstate[j][1] = 0;
        ibitCheck(j);
    }
}
////////////////////////////////////////////////////////////////////////////////
function autoOper(powerstate) {
    if (powerstate >= 1) {
    //EQ7
        if (avstate[7][0] == 0) {
            setTimeout(stateinit, 1000, 7);
        } else if (avstate[7][0] == 1) {
            setTimeout(stateoper, 2000, 7);
            setTimeout(statepass, 4000, 7);
    //EQ5-6
        } else if (avstate[5][0] == 0 && avstate[6][0] == 0 && avstate[7][0] == 2) {
            setTimeout(stateinit, 1000, 5);
            setTimeout(stateinit, 1000, 6);
        } else if (avstate[5][0] == 0 && avstate[7][0] == 2) {
            setTimeout(stateinit, 1000, 5);
        } else if (avstate[6][0] == 0 && avstate[7][0] == 2) {
            setTimeout(stateinit, 1000, 6);
        } else if (avstate[5][0] == 1 && avstate[6][0] == 1 && avstate[7][0] == 2) {
            setTimeout(stateoper, 2000, 5);
            setTimeout(stateoper, 2000, 6);
        } else if (avstate[5][0] == 1 && avstate[7][0] == 2) {
            setTimeout(stateoper, 2000, 5);
        } else if (avstate[6][0] == 1 && avstate[7][0] == 2) {
            setTimeout(stateoper, 2000, 6);
        }
    }

}

function autoOff() {
    if (avstate[7][0] <= 0) {
       EQ7Reset();
       EQ6Reset();
       EQ5Reset();
    }
    if (avstate[5][0] <= 0) {
        EQ6Reset();
    }
    if (avstate[6][0] <= 0) {
        EQ5Reset();
    } else {
        autoOper(powerstate);
    }
}
////////////////////////////////////////////////////////////////////////////////
function EQ7Reset() {
    setTimeout(stateblank, 1000, 5);
    setTimeout(stateblank, 1000, 6);
}
function EQ6Reset() {
    setTimeout(stateblank, 1000, 1);
    setTimeout(stateblank, 1000, 4);
    if (avstate[6][0] !== 2) {
        enablestate = 0;
    }
}
function EQ5Reset() {
    setTimeout(stateblank, 1000, 2);
    setTimeout(stateblank, 1000, 3);
    if (avstate[5][0] !== 2) {
        enablestate = 0;
    }
}

////////////////////////////////////////////////////////////////////////////////
function power2() {
    if (powerstate == 2) {
        for (a = 1; a < 10; a++) {
            b = a.toString();
            document.getElementById(b + 'C').innerHTML = "oper";
            avstate[a][0] = 2;
        }
        enablestate = 1;
        cniOn();
        auxOn();
        icpSel();
        statepass(7);
        avstate[8][1] = 2;
        avstate[9][1] = 2;
        document.getElementById(8 + 'R').innerHTML = "pass";
        document.getElementById(9 + 'R').innerHTML = "pass";
    } else {
        powerstate = 2;
        autoOper(powerstate);
    }
        document.getElementById("1L").innerHTML = "EQ1";
        document.getElementById("2L").innerHTML = "EQ2";
        document.getElementById("3L").innerHTML = "EQ3";
        document.getElementById("8L").innerHTML = "EQ8";
        document.getElementById("9L").innerHTML = "EQ9";
}
function power1() {
    power2();
}
function basic() {
    clearall();
    powerstate = 0;
    enablestate = 0;
    ibitCheck(j);
}
function enable1() {
    if (avstate[5][0] == 2 || avstate[6][0] == 2) {
        enablestate = 1;
        autoOper(powerstate);
    }
}
function clearall() {
    for (a = 1; a < 10; a++) {
        b = a.toString();
        document.getElementById(b + 'C').innerHTML = "&nbsp";
        document.getElementById(b + 'R').innerHTML = "&nbsp";
        avstate[a][0] = 0;
        avstate[a][1] = 0;
    }
}
////////////////////////////////////////////////////////////////////////////////
function outline(j) {
    document.getElementById(j + 'L').style.color = "white";
    document.getElementById(j + 'L').style.border = "2px solid white";
    document.getElementById(j + 'L').style.borderRight = "0px solid white";

    document.getElementById(j + 'C').style.color = "white";
    document.getElementById(j + 'C').style.border = "2px solid white";
    document.getElementById(j + 'C').style.borderLeft = "0px solid white";
    document.getElementById(j + 'C').style.borderRight = "0px solid white";

    document.getElementById(j + 'R').style.color = "white";
    document.getElementById(j + 'R').style.border = "2px solid white";
    document.getElementById(j + 'R').style.borderLeft = "0px solid white";
    ibitCheck(j);
}
function outlineE(j) {
    document.getElementById(j + 'L').style.color = "";
    document.getElementById(j + 'L').style.border = "";
    document.getElementById(j + 'L').style.borderRight = "";

    document.getElementById(j + 'C').style.color = "";
    document.getElementById(j + 'C').style.border = "";
    document.getElementById(j + 'C').style.borderLeft = "";
    document.getElementById(j + 'C').style.borderRight = "";

    document.getElementById(j + 'R').style.color = "";
    document.getElementById(j + 'R').style.border = "";
    document.getElementById(j + 'R').style.borderLeft = "";
}

function scrl(k) {
    i = i + k;
    selector = 1;
    if (i <= 0) {
        i = 9;
    }
    if (i == 10) {
        i = 1;
    }
    j = i.toString();
    outline(j);
    j = j - k;
    if (j == 10) {
        j = 1;
    }
    if (j == 0) {
        j = 9;
    }
    outlineE(j);
    j = i;
}

function mldSelect(n) {
    selector = 1;
    outlineE(j);
    outline(n);
    i = n;
    j = n;
}
//1878128
document.getElementById("1L").addEventListener("click", function(){ mldSelect(1); });
document.getElementById("1C").addEventListener("click", function(){ mldSelect(1); });
document.getElementById("1R").addEventListener("click", function(){ mldSelect(1); });
document.getElementById("2L").addEventListener("click", function(){ mldSelect(2); });
document.getElementById("2C").addEventListener("click", function(){ mldSelect(2); });
document.getElementById("2R").addEventListener("click", function(){ mldSelect(2); });
document.getElementById("3L").addEventListener("click", function(){ mldSelect(3); });
document.getElementById("3C").addEventListener("click", function(){ mldSelect(3); });
document.getElementById("3R").addEventListener("click", function(){ mldSelect(3); });
document.getElementById("4L").addEventListener("click", function(){ mldSelect(4); });
document.getElementById("4C").addEventListener("click", function(){ mldSelect(4); });
document.getElementById("4R").addEventListener("click", function(){ mldSelect(4); });
document.getElementById("5L").addEventListener("click", function(){ mldSelect(5); });
document.getElementById("5C").addEventListener("click", function(){ mldSelect(5); });
document.getElementById("5R").addEventListener("click", function(){ mldSelect(5); });
document.getElementById("6L").addEventListener("click", function(){ mldSelect(6); });
document.getElementById("6C").addEventListener("click", function(){ mldSelect(6); });
document.getElementById("6R").addEventListener("click", function(){ mldSelect(6); });
document.getElementById("7L").addEventListener("click", function(){ mldSelect(7); });
document.getElementById("7C").addEventListener("click", function(){ mldSelect(7); });
document.getElementById("7R").addEventListener("click", function(){ mldSelect(7); });
document.getElementById("8L").addEventListener("click", function(){ mldSelect(8); });
document.getElementById("8C").addEventListener("click", function(){ mldSelect(8); });
document.getElementById("8R").addEventListener("click", function(){ mldSelect(8); });
document.getElementById("9L").addEventListener("click", function(){ mldSelect(9); });
document.getElementById("9C").addEventListener("click", function(){ mldSelect(9); });
document.getElementById("9R").addEventListener("click", function(){ mldSelect(9); });
////////////////////////////////////////////////////////////////////////////////
function cniOn() {
    document.getElementById("CNIon").style.color = "white";
    document.getElementById("CNIoff").style.color = "";
    cniPow = 1;
    autoOper(powerstate);
}

function cniOff() {
    document.getElementById("CNIon").style.color = "";
    document.getElementById("CNIoff").style.color = "white";
    cniPow = 0;
    autoOff(powerstate);
}

function auxOn() {
    document.getElementById("AUXon").style.color = "white";
    document.getElementById("AUXoff").style.color = "";
    auxPow = 1;
    autoOper(powerstate);
}

function auxOff() {
    document.getElementById("AUXon").style.color = "";
    document.getElementById("AUXoff").style.color = "white";
    auxPow = 0;
    autoOff(powerstate);
}
function icpSel() {
    document.getElementById("ICPsel").style.color = "white";
    document.getElementById("MANsel").style.color = "";
    icpState = 1;
    autoOper(powerstate);
}

function manSel() {
    document.getElementById("MANsel").style.color = "white";
    document.getElementById("ICPsel").style.color = "";
    icpState = 0;
    autoOff(powerstate);
}
cniOn();
auxOn();
manSel();
////////////////////////////////////////////////////////////////////////////////
function ibitCheck(j) {
    if (selector == 1) {
        if (avstate[j][0] == 2 && avstate[j][1] !== 1) {
            document.getElementById("startibit").innerHTML = "start<br>ibit";
            document.getElementById("startibit").style.color = "lawngreen";
            document.getElementById("stopibit").innerHTML = "";
            document.getElementById("startibit").style.backgroundColor = "";
            document.getElementById("startibit").style.width = "";
        } else {
            document.getElementById("startibit").innerHTML = "";
            document.getElementById("stopibit").innerHTML = "";
            document.getElementById("startibit").style.backgroundColor = "";
            document.getElementById("startibit").style.width = "";
        }
        if (avstate[j][1] == 1) {
            document.getElementById("startibit").innerHTML = "start<br>ibit";
            document.getElementById("startibit").style.color = "white";
            if (j < 5 || j > 6 && j !== 9) {
                document.getElementById("stopibit").innerHTML = "stop<br>ibit";
            }
        }
    }
}

function invOff() {
    document.getElementById("off").style.color = "black";
    document.getElementById("off").style.backgroundColor = "lawngreen";
}
function invReset() {
    document.getElementById("reset").style.color = "black";
    document.getElementById("reset").style.backgroundColor = "lawngreen";
}
function invOper() {
    document.getElementById("oper").style.color = "black";
    document.getElementById("oper").style.backgroundColor = "lawngreen";
}
function regAll() {
    document.getElementById("off").style.color = "";
    document.getElementById("off").style.backgroundColor = "";
    document.getElementById("reset").style.color = "";
    document.getElementById("reset").style.backgroundColor = "";
    document.getElementById("oper").style.color = "";
    document.getElementById("oper").style.backgroundColor = "";
}
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
var numin;
var counter = 0;
var nummax = 99999999999;
var numzero = nummax;
var redzero = 0;

////////////////
var leadingzeros = 0;
var numstart = 0;
var numfinal = null;
var icpcounter = 0;

numInput = (k) => {
    if (icpcounter < 12) {
        if (numstart == 1) {
            numfinal = numfinal * 10 + k;
        } else if (k) {
            numfinal = numfinal * 10 + k;
            numstart = 1;
        } else {
            leadingzeros++;
        }
        icpcounter++;
        numBuild();
    }
}

function clrOne() {
    if (icpcounter > 0) {
        clearTimeout(clrHold);
        numfinal = Math.floor(numfinal / 10);
        icpcounter--;
        numBuild();
    } else {
       return
    }
}

function clrAll() {
    numfinal = null;
    icpcounter = 0;
    leadingzeros = 0;
    for (a = 1; a <= 12; a++) {
        document.getElementById("icpInputField" + a).innerHTML = "";
    }
}

function numBuild() {
    for (a = 1; a <= icpcounter; a++) {
        b = numfinal / (10 ** (a - 1));
        c = Math.floor(b) % 10;
        document.getElementById("icpInputField" + a).innerHTML = c;
    }
    for (a = icpcounter + 1; a <= 12; a++) {
        document.getElementById("icpInputField" + a).innerHTML = "";
    }
}

document.getElementById('clr').onmousedown = function() {clrHold = setTimeout(clrAll, 1000)};
document.getElementById('clr').onmouseup = function() {clrOne()};

////////////////////////////////////////////////////////////////////////////////

var icptracker = 0;
var sub = 0;
var key = 0;
var subkey = 0;
var keylock = 0;
var othrNet = 0;
var space = "&nbsp";
var arrow = "&#9654";
var option = [space, arrow];
var arrowon = 0;

var arrows = [[1001, 1], [2001, 1]];


function icpCstr(value1, value2, value3, value4, value5) {
    this.inone = value1;
    this.intwo = value2;
    this.inthree = value3;
    this.infour = value4;
    this.infive = value5;
}

var com1_a01 = new icpCstr("com 1", "hq options>", "p ct cto","grd off t/r r", "grd uhf vhf");
var com1_a21 = new icpCstr("tnet fmt", "a/b nt nnt", "tod", "tone", "gps update");
var com1_b01 = new icpCstr("pset 10", 350.000, "key 3 com 1", "sqlch", "");

var com2_a01 = new icpCstr("com 2", "hq options>", "p ct cto","grd off t/r", "grd uhf vhf");
var com2_a21 = new icpCstr("tnet fmt", "a/b nt nnt", "tod", "tone", "gps update");
var com2_b01 = new icpCstr("pset 10", 350.000, "key 3 com 2", "sqlch", "");


// = new icpCstr("", "", "", "", "");

///////////////////[function][subfunction][key][subkey]
var com1_a0 = [com1_a01];
var com1_a2 = [com1_a21];
var com1_b0 = [com1_b01];
var com2_a0 = [com2_a01];
var com2_a2 = [com2_a21];
var com2_b0 = [com2_b01];





var com1_a = [com1_a0, 0, com1_a2, 0, 0, 0];
var com1_b = [com1_b0];
var com2_a = [com2_a0, 0, com2_a2, 0, 0, 0];
var com2_b = [com2_b0];




var com1func = [com1_a, com1_b];
var com2func = [com2_a, com2_b];




var icpobj = [
    0,
    com1func,
    com2func,
];

////////////////////////////////////////////////////////

function icpfunc(a) {
    var icpcounter = 1;
    console.log("icpfunc");
    for (x in icpobj[a][0][0][0]) {
        document.getElementById("icp" + icpcounter).innerHTML = option[0] + icpobj[a][0][0][0][x];
        icpcounter++;
    }
    icptracker = a;
    sub = 0;
    key = 0;
    subkey = 0;
    keylock = 0;
    othrNet = 0;
    icparrows();
}

function tabswitch(a) {
    console.log("tabswitch");
    if (key == 0) {
        if (a == 1 && sub < icpobj[icptracker].length - 1) {
            sub++;
        } else if (a == 0 && sub > 0) {
            sub--;
        }
    } else {
        if (a == 1 && subkey < icpobj[icptracker][sub][key].length - 1) {
            subkey++;
        } else if (a == 0 && subkey > 0) {
            subkey--;
        } else if (a == 0 && subkey == 0 && othrNet == 0) {
            key = 0;
            keylock = 0;
        }
    }
    var icpcounter = 1;
    for (x in icpobj[icptracker][sub][key][subkey]) {
        document.getElementById("icp" + icpcounter).innerHTML = option[0] + icpobj[icptracker][sub][key][subkey][x];
        icpcounter++;
    }
    icparrows();
}

function icpoption(keyin) {
    var icpcounter = 1;
    console.log("icpoption");
    if (typeof icpobj[icptracker][sub][keyin][0] == 'object' && keylock == 0) {
        for (x in icpobj[icptracker][sub][keyin][0]) {
            document.getElementById("icp" + icpcounter).innerHTML = option[0] + icpobj[icptracker][sub][keyin][0][x];
            icpcounter++;
        }
        key = keyin;
        keylock = 1;
        icpcounter = 1;
    } else {
        for (a = 1; a < arrow.length; a++) {
            if ((icptracker * 1000 + sub * 100 + key * 10 + keyin) == arrows[a - 1][0] && othrNet == 0) {
                if (arrows[a - 1][1] == 0) {
                    arrows[a - 1][1] = 1;
                } else {
                    arrows[a - 1][1] = 0;
                }
                icparrows();
                ufdupdate();
            }
        }
    }
    icparrows();
}

function icparrows() {
    for (b = 1; b <= 5; b++) {
        for (c = 1; c <= arrows.length; c++) {
            if ((icptracker * 1000 + sub * 100 + key * 10 + b) == arrows[c - 1][0] && othrNet == 0) {
                document.getElementById("icp" + b + "pre").innerHTML = option[arrows[c - 1][1]];
                break;
            } else {
                document.getElementById("icp" + b + "pre").innerHTML = "";
            }
        }
    }
}

////////////////////////////////
////////////////////////////////
function testbutton() {
    //console.log("EQ4: " + avstate[4][0]);
}

var com1freq = 350.500;
var com2freq = 150.5;

function ufdupdate() {
    //com1
    if (arrows[0][1] == 1) {
        document.getElementById("com1-1").innerHTML = "uhf";
        document.getElementById("com1-2").innerHTML = com1freq.toFixed(3) + " g";
    } else {
        document.getElementById("com1-1").innerHTML = "com1 off";
        document.getElementById("com1-2").innerHTML = "";
    }
    //com2
    if (arrows[1][1] == 1) {
        document.getElementById("com2-1").innerHTML = "vhf";
        document.getElementById("com2-2").innerHTML = com2freq.toFixed(3);
    } else {
        document.getElementById("com2-1").innerHTML = "com2 off";
        document.getElementById("com2-2").innerHTML = "";
    }
}

function cominput(a) {
    if (numfinal > 0 && numfinal % 50 == 0) {
        if (numfinal >= 200000 && numfinal <= 400000) {
            document.getElementById("com" + a + "-1").innerHTML = "uhf";
            document.getElementById("com" + a + "-2").innerHTML = (numfinal / 1000).toFixed(3) + " g";
            com1freq = numfinal / 1000;
            clrAll();
        } else if ((numfinal >= 100000 && numfinal <= 130000) || numfinal == 140000) {
            document.getElementById("com" + a + "-1").innerHTML = "vhf";
            document.getElementById("com" + a + "-2").innerHTML = (numfinal / 1000).toFixed(3) + " g";
            com1freq = numfinal / 1000;
            clrAll();
        } else {
            clrAll();
            document.getElementById("icpInputField" + 7).innerHTML = "i";
            document.getElementById("icpInputField" + 6).innerHTML = "n";
            document.getElementById("icpInputField" + 5).innerHTML = "v";
            document.getElementById("icpInputField" + 4).innerHTML = "a";
            document.getElementById("icpInputField" + 3).innerHTML = "l";
            document.getElementById("icpInputField" + 2).innerHTML = "i";
            document.getElementById("icpInputField" + 1).innerHTML = "d";
            numfinal = null;
            setTimeout(delayclear, 2000);
        }
    } else if (numfinal != null) {
            clrAll();
            document.getElementById("icpInputField" + 7).innerHTML = "i";
            document.getElementById("icpInputField" + 6).innerHTML = "n";
            document.getElementById("icpInputField" + 5).innerHTML = "v";
            document.getElementById("icpInputField" + 4).innerHTML = "a";
            document.getElementById("icpInputField" + 3).innerHTML = "l";
            document.getElementById("icpInputField" + 2).innerHTML = "i";
            document.getElementById("icpInputField" + 1).innerHTML = "d";
            numfinal = null;
            setTimeout(delayclear, 2000);
    }
}
function delayclear() {
    if (document.getElementById("icpInputField" + 1).innerHTML == "d") {
        clrAll();
    }
}

