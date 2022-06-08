
const data_id_dict = {
    "Thermal Set Point": "7777" // TEMPORARY DATA ID
};

export default function SendMessage(msg, field_to_modify) {
    console.log("Function wants to send message:", msg, "to update", field_to_modify);

    var webaddress = 'ws://localhost:8888/ws/' + data_id_dict[field_to_modify];
    console.log(webaddress);
    const ws = new WebSocket(webaddress);
    ws.onopen = function (event) {
        ws.send(JSON.stringify({
            data_type: 1,
            data: msg,
        }))
        console.log("sent")
    }
    ws.onmessage = function (event) {
        console.log(event.data)
    }
    ws.onclose = function (event) {
        console.log(event)
    }
}