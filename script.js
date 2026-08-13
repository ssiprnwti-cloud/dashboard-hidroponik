// Konfigurasi MQTT
const broker="wss://broker.hivemq.com:8884/mqtt";
const options={
    clientId:"dashboard_"+Math.random().toString(16).substr(2,8)
};
const client=mqtt.connect(broker,options);

// Data Grafik
let waktu=[];
let dataSuhu=[];
let dataHum=[];
let dataSoil=[];

// Koneksi MQTT
client.on("connect",()=>{
    console.log("Terhubung ke MQTT");
    client.subscribe("hidroponik/data");
    client.subscribe("hidroponik/pompa");
});

// Menerima Data MQTT
client.on("message",(topic,message)=>{
    let data=message.toString();
    console.log(topic+" : "+data);

if(topic==="hidroponik/data"){

    const obj = JSON.parse(data);

    document.getElementById("suhu").innerHTML =
        obj.suhu + " °C";

    document.getElementById("Kelembapan").innerHTML =
        obj.kelembapan + " %";

    document.getElementById("soil").innerHTML =
        obj.soil + " %";

    document.getElementById("Notifikasi").innerHTML =
        obj.status;

    waktu.push(new Date().toLocaleTimeString());

    dataSuhu.push(obj.suhu);
    dataHum.push(obj.kelembapan);
    dataSoil.push(obj.soil);

    if(waktu.length>10){
        waktu.shift();
        dataSuhu.shift();
        dataHum.shift();
        dataSoil.shift();
    }

    monitoringChart.data.labels = waktu;
    monitoringChart.data.datasets[0].data = dataSuhu;
    monitoringChart.data.datasets[1].data = dataHum;
    monitoringChart.data.datasets[2].data = dataSoil;
    monitoringChart.update();

}
});

// Kontrol Pompa
function pompaON(){
    client.publish("hidroponik/pompa","ON");
    console.log("Pompa ON");
    alert("Pompa Dinyalakan");
}

function pompaOFF(){
    client.publish("hidroponik/pompa","OFF");
    console.log("Pompa OFF");
    alert("Pompa Dimatikan");
}

// Status MQTT
client.on("reconnect",()=>{
    console.log("Menghubungkan kembali...");
});

client.on("offline",()=>{
    console.log("MQTT Offline");
});

client.on("error",(err)=>{
    console.log("MQTT Error:",err);
});

client.on("close",()=>{
    console.log("Koneksi MQTT Terputus");
});