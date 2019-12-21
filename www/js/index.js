/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    deviceMAC:'',
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.getElementById("submit-button").addEventListener("click", this.onSubmitForm);

    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    onSubmitForm: function(){
        valueToPay = document.getElementById("transaction-value").value;
        console.log('Received Event Submit: value transaction = '+ valueToPay);
        bluetoothSerial.list(
            function(results) {
                results = app.FilterPagSeguroBluetoothDevices(results);
                // app.display(JSON.stringify(results));

                if(results.length == 0) alert('Nenhuma maquininha encontrada. Verifique o pareamento do dispositivo');
                if(results.length == 1 ) chooseDevice(results[0].address);
                if(results.length > 1) FillDevicesToChoose(results);

            },
            function(error) {
                alert(JSON.stringify(error));
                // app.display(JSON.stringify(error));
            }
        );

        cordova.plugins.PlugPag.getLibVersion(
            function(res){
                app.display('Plugpag lib result: ' + JSON.stringify(res));
            },
            function(error){
                app.display('Plugpag lib Error: ' + JSON.stringify(error));
            }
        )
    },
    createPayment: function() {
        console.log('Create Payment Method');
        
    },
    /*
        appends @message to the message div:
    */
    display: function(message) {
        var display = document.getElementById("message"), // the message div
            lineBreak = document.createElement("br"),     // a line break
            label = document.createTextNode(message);     // create the label

        display.appendChild(lineBreak);          // add a line break
        display.appendChild(label);              // add the message node
    },

    /**Method to filter availables PAGSEGURO devices */
    FilterPagSeguroBluetoothDevices(devices) {
        let filtered = [];
        if (devices == null) return;

        //WITH MORE THAN ONE DEVICE
        devices.forEach(element => {
        if (element.name.startsWith("PRO-") ||
            element.name.startsWith("W-") ||
            element.name.startsWith("W+-") ||
            element.name.startsWith("MOBI-") ||
            element.name.startsWith("PAX-") ||
            element.name.startsWith("PLUS-") ||
            element.name.startsWith("MCHIP-"))   filtered.push(element);
        
        });
        return filtered;
    }
};

var valueToPay;

function chooseDevice(device){
    console.log(device);
    console.log(valueToPay);
    app.display(`Trying to connect on device: ${device} -> R$${(valueToPay/100).toFixed(2)}`);

    document.getElementById('devices').innerHTML =('');


/**
 * {
        deviceIdentification:string;
        PaymentType:1|2|3; 1=CREDITO, 2=DEBITO, 3=VOUCHER
        InstallmentType:1|2; 1=A_VISTA, 2=PARC_VENDEDOR
        SaleRef:string;
        installments:number;
        amount:number;
    }
 */
    let paymentObj = {
        deviceIdentification:device,
        PaymentType:1,
        InstallmentType:1,
        SaleRef:'CODVENDA',
        installments:1,
        amount:parseInt(valueToPay)
    };

    app.display(JSON.stringify(paymentObj));

    cordova.plugins.PlugPag.startPayment(paymentObj,function(success){
        if(success.TransactionCode){
            alert('Pagamento Realizado com Sucesso!');
        }
        else{
            alert('Falha no pagamento: '+success.Message);
        }

    },
    function(error){
        alert('Falha ao comunicar com a biblioteca de pagamento.');
        app.display(JSON.stringify(error));
    })

    // cordova.plugins.PlugPag.initBTConnection(deviceId,function(success){
    //     if(success.Result == 0){
    //         //communication with device works
    //         cordova.plugins.PlugPag.startPayment(paymentObj,function(success){
    //             if(success.TransactionCode){
    //                 alert('Pagamento Realizado com Sucesso!');
    //             }
    //             else{
    //                 alert('Falha no pagamento: '+success.Message);
    //             }

    //         },
    //         function(error){
    //             alert('Falha ao comunicar com a biblioteca de pagamento.');
    //         })

    //     }else{
    //         //communication not succeded
    //         alert('Não foi possivel comunicar com o dispositivo. Verifique se a maquininha está ligada ou ao alcançe do bluetooth.');
    //     }
    // },
    // function(error){
    //  alert('Falha ao comunicar com a biblioteca de comunicação.');
    // })
}

function FillDevicesToChoose(devices){
    let stringResult = ``;

    devices.forEach(el=>{
        stringResult += `
        <div class="row" onclick="chooseDevice('${el.address}')" style="display: -webkit-box; padding: 10px 25px;background-color: white; margin: 5px 10px;border: 1px black solid;">
            <div class="col-sm-4" style="width: 33%;">
                <img src="img/${GetDeviceImage(el.name)}" style="height: 80px;object-fit: contain;">
            </div>
            <div class="col-sm-8" style="margin-top:5px;display: inline-grid;">
                <h2 style="margin-bottom: 0;">Moderninha</h2>
                <label style="color: darkgrey;">${el.name}</label>
            </div>
        </div>
        `;
    });

    document.getElementById('devices').innerHTML = (stringResult);
}

/** Get image by type of device  */
function GetDeviceImage(name){
  if(name.startsWith('PRO-')) return 'img/moderninha_pro.png';
  else if(name.startsWith('PAX-') || name.startsWith("MCHIP-")) return 'img/minizinha_chip.png';

  return null;
}