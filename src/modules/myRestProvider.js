import {
	fetchUtils,
	GET_LIST,
	GET_ONE,
	GET_MANY,
	GET_MANY_REFERENCE,
	CREATE,
	UPDATE,
	UPDATE_MANY,
	DELETE,
	DELETE_MANY
} from 'ra-core';


/* **** MAPS react-admin QUERIES TO MY REST API ****  */

const apiURL = 'http://localhost:3000/api/';

const convertDataRequestToHTTP = (type, resource, params) => {

	let url = '';
	const options = {
		method: 'GET',
		credentials: 'include',
		mode: 'cors'
	}; 

	/* const options = {
		method: 'GET'
	};  */

	switch (type) {
	case GET_LIST: //  ********* GET_LIST ***********
	{
		const { page, perPage } = params.pagination;
		const { field, order } = params.sort;
		
		const query = {
			page,
			limit: perPage,
			sort: JSON.stringify({
				field,
				order
			}),
			filter: JSON.stringify(params.filter)
		};

		const qs = new URLSearchParams(query).toString();

		if (resource === 'departments') {

			url = `${apiURL}categories/admin?${qs}`;

		}
		
		if (resource === 'subdepartments') {

			url = `${apiURL}categories/sub/admin?${qs}`;

		}

		if (resource === 'item_specials') {

			url = `${apiURL}specials/admin?${qs}`;

		}
		
		/* if (resource === 'items') {
			
			url = `${apiURL}items/admin?${qs}`;

		} */
		break;
	}
	case GET_ONE: // *********** GET ONE **************
	{
		const { id } = params;

		if (resource === 'item_specials') {

			url = `${apiURL}specials/${id}`;

		} 


		// if (resource === 'departments') {

		// url = `${apiURL}categories/${id}`;

		// } 
		
		// if (resource === 'subdepartments') {

		// url = `${apiURL}categories/sub/${id}`;

		// } 
		
		// if (resource === 'items') {

		// url = `${apiURL}items/${id}`;

		// }

		break;
	}
	case GET_MANY: // *********** GET MANY **************
	{
		
		const query = {
			filter: JSON.stringify({ ids: params.ids })
		};

		const qs = new URLSearchParams(query).toString();

		if (resource === 'departments') {

			url = `${apiURL}categories/many?${qs}`;

		} 
		
		if (resource === 'subdepartments') {

			url = `${apiURL}categories/sub/many?${qs}`;

		} 
		
		if (resource === 'items') {
			
			url = `${apiURL}items/many?${qs}`;
			
		}

		if (resource === 'images') {
			
			url = `${apiURL}categories/images/many?${qs}`;

		}

		if (resource === 'item_specials') {
			
			url = `${apiURL}specials/admin?${qs}`;

		}


		break;
	}
	case GET_MANY_REFERENCE:
	{
		const { page, perPage } = params.pagination;
		const { field, order } = params.sort;
		
		const query = {
			page,
			limit: perPage,
			sort: JSON.stringify({
				field,
				order
			}),
			filter: JSON.stringify({
				...params.filter,
				[params.target]: params.id
			})
		};

		const qs = new URLSearchParams(query).toString();

		if (resource === 'departments') {

			url = `${apiURL}categories/admin?${qs}`;

		} 
		
		if (resource === 'subdepartments') {

			url = `${apiURL}categories/sub/admin?${qs}`;

		} 
		
		/* if (resource === 'items') {
			
			url = `${apiURL}items/admin?${qs}`;

		} */
		

		break;
	}
	case CREATE:
	{

		options.method = 'POST';

		if (resource === 'item_specials') {

			url = `${apiURL}specials/`;
				
			options.body = JSON.stringify({
				filter: params.data
			});
		} 
		

		/* if (resource === 'departments') {

			url = `${apiURL}categories/`;
	
			const { code, name, description } = params.data;

			options.body = JSON.stringify({
				code,
				name,
				description
			});
		} */
		
		/* if (resource === 'subdepartments') {

			const {
				categoryId,
				code,
				name,
				description
			} = params.data;

			url = `${apiURL}${categoryId}/sub`;

			options.body = JSON.stringify({
				code,
				name,
				description
			});
		
		} */
		
		/* if (resource === 'items') {

			url = `${apiURL}items/`;
	
			options.body = JSON.stringify(params.data);
		} */

		break;
	}
	case UPDATE:
	{
		const { id } = params;

		options.method = 'PUT';

		const query = {				
			filter: params.data
		};
		
		options.body = JSON.stringify(query);
		
		if (resource === 'item_specials') {

			url = `${apiURL}specials/${id}`;
		
		} 
		
		/* if (resource === 'departments') {

			url = `${apiURL}categories/${id}`;
		
		} */
		
		/* if (resource === 'subdepartments') {

			url = `${apiURL}sub/${id}`;
		
		} */
		
		/* if (resource === 'items') {

			url = `${apiURL}items/${id}`;
			
		} */

		break;
	}
	case UPDATE_MANY:
	{

		break;
	}
	case DELETE:
	{
	
		break;
	}
	case DELETE_MANY:
	{

		break;
	}
	default:

	}

	return { url, options };

};


const convertHTTPResponse = (response, type, resource, params) => {

	const { headers, json } = response;

	switch (type) {
	case GET_LIST:
	case GET_MANY_REFERENCE:
	{
		if (!headers.has('content-range')) {
			throw new Error('The Content-Range header is missing in the HTTP Response.');
		}
		
		return {
			data: json.data.results.docs.map(record => ({ id: record._id, ...record })),
			total: parseInt(headers.get('content-range'), 10)
		};	
	}
	case GET_ONE:
	{
		if (resource === 'item_specials') {

			return {
				data: {
					id: json.data.special._id,
					...json.data.special					
				}
			};

		}  
		/* if (resource === 'departments') {

			return {
				data: {
					id: json.data.category._id,
					...json.data.category					
				}
			};

		}  */
		
		/* if (resource === 'subdepartments') {

			return {
				data: {
					id: json.data.subcategory._id,
					...json.data.subcategory					
				}
			};

		} */
		
		/* if (resource === 'items') {

			return {
				data: {
					id: json.data.item._id,
					...json.data.item					
				}
			};
			
		}	*/

		break;
	}
	case GET_MANY:
	{
		
		if (resource === 'items' || resource === 'departments' || resource === 'subdepartments') {
			
			const { results } = json.data;
			
			
			const newResults = results.map(item => {

				return {
					id: item._id,
					...item
				};
			});
	
			
			return {
				data: newResults
			};

		}

		if (resource === 'images') {

			const results = json.data;
			
			const newResults = results.map(item => {
				/* NOTA: EN LA API VIENE data, QUE ES UN ARRAY CONVERTIDO A JSON  */
				/* ESE ARRAY ES DE DOCUMENTOS DE LA FORMA { _id: xxx, image: xxxx }  */
				/* image es un Buffer de Node.js, pero que fué convertido en JSON  */
				/* Por lo tanto hay que convertirlo DE NUEVO a Buffer, con Buffer.from */
				/* Luego, debemos crear un Blob para poder usar URL.createObjectURL */
				/* ya que ese método solo usa Blobs o Files */
				/* Por último, URL.createObjectURL nos da el url de la imágen */
				return {
					id: item._id,
					url: URL.createObjectURL(new Blob([Buffer.from(item.image)]))
				};

			});
			
			return {
				data: newResults
			};

		}

		break;
		
	}
	case UPDATE:
	{
		if (resource === 'item_specials') {

			return {
				data: {
					id: json.data.special._id,
					...json.data.special
				}
			};

		}

		/* if (resource === 'departments') {

			return {
				data: {
					id: json.data.category._id,
					...json.data.category
				}
			};

		} */

		/* if (resource === 'subdepartments') {

			return {
				data: {
					id: json.data.subcategory._id,
					...json.data.subcategory
				}
			};

		} */

		/* if (resource === 'items') {

			return {
				data: {
					id: json.data.item._id,
					...json.data.item
				}
			};

		}  */
		break;
	}

	default:
		return {
			data: json.data.results.docs.map(record => ({ id: record._id, ...record }))
		};
	}

};

export default (type, resource, params) => {
	
	const { fetchJson } = fetchUtils;
	const { url, options } = convertDataRequestToHTTP(type, resource, params);

	return fetchJson(url, options).then(response => convertHTTPResponse(response, type, resource, params));


};
