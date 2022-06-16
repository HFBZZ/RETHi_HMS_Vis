import axios from 'axios';

const data_id_dict = {
    "thermal_set_point": "6", // TEMPORARY DATA ID
    "power_set_point": "7", // TEMPORARY DATA ID
};

export default function SendMessage(msg, field_to_modify) {
    console.log("Function wants to send message:", msg, "to update", field_to_modify);

    var data_id = data_id_dict[field_to_modify];
    if (data_id == undefined) {
        console.log("Error: Target Telemetry not recognized:", field_to_modify);
    }
    else {
        // axios <- library
        // var wsaddress = 'ws://localhost:8888/ws/' + data_id;
        var httpAaddress = 'http://localhost:8888/comm/' + data_id;
        console.log(httpAaddress);
        // const ws = new WebSocket(webaddress);
        // ws.onopen = function (event) {
        //     ws.send(JSON.stringify({
        //         data_type: 1,
        //         data: msg,
        //     }))
        //     console.log("sent")
        // }
        // ws.onmessage = function (event) {
        //     console.log(event.data)
        // }
        // ws.onclose = function (event) {
        //     console.log(event)
        // }

        // AXIOS version
        axios.post(httpAaddress, {
            data_type: 1,
            data: msg,
        })
        .then((response) => {
            console.log(response);
        }, (error) => {
            console.log(error);
        });
    }
}