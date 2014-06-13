
function byteToHex(b)
{
    if(b<16)
       return "0"+ b.toString(16);
    else
        return  b.toString(16);

}




// Utils
function intFromBytes( x ){
    var val = 0;
    for (var i = 0; i < x.length; ++i) {
        val += x[i];
        if (i < x.length-1) {
            val = val << 8;
        }
    }
    return val;
}


function toHex(str) {
    var hex = '';
    for(var i=0;i<str.length;i++) {
        hex += ''+str.charCodeAt(i).toString(16);
    }
    return hex;
}

function toStr(hexstr) {
    var str = "";
    for (var i = 0; i < hexstr.length; i+=2) {
        var charCode = parseInt(hexstr.substr(i,2), 16);
        str += String.fromCharCode(charCode);

    }
    return str;
}
function arrayToHexStr(array) {
    var hexStr = array.map(function (x) {
        x = x.toString(16); // to hex
        x = ("00" + x).slice(-2);
        return x;
    }).join('');
    return hexStr;
}



function isValidChannel(channel) {
    if (channel <= 0 || channel == null || channel === undefined) {
        return false;
    }
    return true;
}




function iccCloseChannel(channel) {
    var req = window.navigator.mozTelephony.iccCloseChannel(channel);
    channelId = 0;
    req.onsuccess = function() {        
        //alert("INFO: Close Success! ");
    }
    req.onerror = function() {
        //alert("ERROR: Close Failure! Return data: (" + JSON.stringify(this.error) + ")");
    }
}




function iccOpenChannelWithCallback(aidhexstr, callback) {
    var req = window.navigator.mozTelephony.iccOpenChannel(aidhexstr);
    req.onsuccess = function() {
        if (!isValidChannel(this.result)) {
                alert("INFO: Channel ID invalid. All channels in use.");
        } else {
              //  alert("INFO: Open returns success. Channel: (" + JSON.stringify(this.result) + ")");
                channelId = this.result;
		//alert(callback);
                if(callback != undefined && typeof callback == 'function')
                   callback();
            }
    }
    req.onerror = function() {
        alert("ERROR: Open Failure! Return data: (" + JSON.stringify(this.error) + ")");
 	if(callback != undefined && typeof callback == 'function')
           callback();
    }
}

function iccExchangeAPDUWithCallback(channel, apdu, callback) {

    //alert("enter iccExchangeAPDUWithCallback()...");

    var cmd = byteToHex(apdu.cla)+byteToHex(apdu.command)+byteToHex(apdu.p1)+byteToHex(apdu.p2)+byteToHex(apdu.p3)+apdu.data;

   // alert("cmd="+cmd);

    if(apdu.p3>0)
        apdu.data = apdu.data + "00";
    
//            alert("cmd: " + cmd);

    var req = window.navigator.mozTelephony.iccExchangeAPDU(
            channel, apdu);

    req.onsuccess = function() {

        //appendTextAndScroll("#output", " this.result: " + this.result+", this.result.length="+this.result.length);

            //transmitResult = toStr(this.result[2]);
        transmitResult = this.result[2];
        //alert("response:" + transmitResult);

        //alert("callback="+callback);

        //run our callback
        if(callback != undefined && typeof callback == 'function')
            callback();

	
    }
    req.onerror = function() {
       //            alert("ERROR: APDU Exchange Failure! Return data: (" + JSON.stringify(this.result) + ")");
        if(callback != undefined && typeof callback == 'function')
            callback();

    }

    
}

function iccCloseChannelWithCallback(channel, callback) {
    var req = window.navigator.mozTelephony.iccCloseChannel(channel);
    channelId = 0;
    req.onsuccess = function() {
        //alert("INFO: Close Success! Return data: (" + JSON.stringify(this.result) + ")");

        if(callback != undefined && typeof callback == 'function')
           callback();
    }
    req.onerror = function() {
        alert("ERROR: Close Failure! Return data: (" + JSON.stringify(this.error) + ")");
        if(callback != undefined && typeof callback == 'function')
        	callback();
    }
}


// NFC Secure Element listeners
function addSecureElementListeners() {
    addSecureElementActivatedListener();
    addSecureElementDeactivatedListener();
    addSecureElementTransactionListener();
}

function removeSecureElementListeners() {
    removeSecureElementActivatedListener();
    removeSecureElementDeactivatedListener();
    removeSecureElementTransactionListener();
}

function addSecureElementActivatedListener() {
    navigator.mozNfc.onsecureelementactivated = function(event) {
        var messageType = event.nfcMessages.type;
        if (messageType == "secureElementActivated") {
            var message = "Secure Element Activated.";
            alert(message+"\n");
        }
    }
}
function addSecureElementDeactivatedListener() {
    navigator.mozNfc.onsecureelementdeactivated = function(event) {
        var messageType = event.nfcMessages.type;
        if (messageType == "secureElementDeactivated") {
            var message = "Secure Element Deactivated.";
//            alert(message+"\n");
        }
    }
}
function addSecureElementTransactionListener() {
    navigator.mozNfc.onsecureelementtransaction = function(event) {
        var messageType = event.nfcMessages.type;
        var content = event.nfcMessages.content;
        if (messageType == "secureElementTransaction") {
	   // navigator.mozVibrate(2000);
            var message = "Secure Element Transaction complete. AID: " + content.aid + ", DATA: " + content.data;
		
//            alert(message+"\n");
  
//mozVibrate doesn#t work!!!
//window.navigator.mozVibrate(2000);     
            var payment_trans = content.data.substring(2*(2+content.aid.length/2+2));  
            //alert("payment_trans_data:"+payment_trans +"\n");
            alert(toStr(payment_trans));
        }
    }
}

function removeSecureElementActivatedListener() {
    navigator.mozNfc.onsecureelementactivated = null;
}

function removeSecureElementDeactivatedListener() {
    navigator.mozNfc.onsecureelementdeactivated = null;
}

function removeSecureElementTransactionListener() {
    navigator.mozNfc.onsecureelementtransaction = null;
}

