import axios from 'axios';

const Api = axios.create({
	baseUrl: "http://localhost:8000",
	responseType: "json"
});

export default Api;