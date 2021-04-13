const fetch = require('node-fetch');
const querystring = require('querystring');
const cookie = require('cookie');

/**
 * Fetches a new public cookie from Vinted.fr
 */
const fetchCookie = async () => {
    const res = await fetch('https://vinted.fr');
    const sessionCookie = res.headers.get('set-cookie');
    return cookie.parse(sessionCookie)['secure, _vinted_fr_session'];
}

/**
 * Searches something on Vinted
 */
const search = async (query, options = {}, cookie) => {

    const params = querystring.encode({
        search_text: query,
        ...options
    });

    if (!cookie) {
        cookie = await fetchCookie();
    }

    const res = await fetch('https://www.vinted.fr/api/v2/items?' + params, {
        headers: {
            cookie: '_vinted_fr_session=' + cookie
        }
    });
    
    const text = await res.text();
    try {
        return JSON.parse(text);
    } catch (e) {
        throw text;
    }

}

module.exports.fetchCookie = fetchCookie;
module.exports.search = search;
