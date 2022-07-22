const data_id_dict = {
    "temperature": "8003",
    "pressure": "8007",
    "temperature_set_point": "10001",
    "temperature_set_point_response": "10002",
    "pressure_set_point": "10003",
    "pressure_set_point_response": "10004",
};

export default function ConvertToDataID(name) {
    return data_id_dict[name];
}