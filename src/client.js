const API_KEY = 'db95f036-21a7-48f4-9ecf-2bb5afd8408c';

class Client {
    get(url, params = {}) {
        const queryString = this.createQueryString(params);
        return fetch(`${url}${queryString}`, { headers: { 'x-api-key': API_KEY } })
            .then(response => response.json())
            .catch(ex => console.error('Error: ' + ex))
    }

    post(url, data = {}) {
        return fetch(url, {
            headers: {
                'x-api-key': API_KEY,
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .catch(ex => console.error('Error: ' + ex))
    }

    postMultiPartForm(url, data = {}, resolve, reject) {
        return fetch(url, {
            headers: {
                'x-api-key': API_KEY
            },
            method: 'POST',
            body: data
        })
        .catch(ex => console.error('Error: ' + ex));
    }

    createQueryString(params) {
        const stringParams = [];
        for (let name in params) {
            stringParams.push(`${name}=${params[name]}`);
        }
        if (stringParams.length <= 0) {
            return '';
        }
        return `?${stringParams.join('&')}`;
    }
}

export default new Client();
