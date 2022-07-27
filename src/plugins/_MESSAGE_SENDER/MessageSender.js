import axios from 'axios';
import EmailNotification from './EmailNotifiier';
import ConvertToDataID from './NameDataIDConverter';

export default function SendMessage(msg, field_to_modify) {
    console.log("Function wants to send message:", msg, "to update", field_to_modify);

    // if (field_to_modify == "temp_hazard") {
    //     EmailNotification("Habitat Hazard: Internal Temperature", "Temperature levels of the interior environment are critical: " + msg);
    // }

    var data_id = ConvertToDataID(field_to_modify);
    if (data_id == undefined) {
        console.log("Error: Target Telemetry not recognized:", field_to_modify);
    }
    else {
        var httpAaddress = 'http://localhost:9999/api/c2/' + data_id;
        console.log(httpAaddress);
        // AXIOS version
        console.log(parseFloat(msg));
        axios.post(httpAaddress, {
            value: parseFloat(msg),
        })
        .then((response) => {
            console.log(response);
        }, (error) => {
            console.log(error);
        });
    }
}