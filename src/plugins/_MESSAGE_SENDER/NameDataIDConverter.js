const data_id_dict = {
    "temperature": "8003",
    "pressure": "8007",
    "temperature_set_point": "10001",
    "pressure_set_point": "10002",
};

export default function ConvertToDataID(name) {
    return data_id_dict[name];
}